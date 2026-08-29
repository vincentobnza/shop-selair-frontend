/** The pixel box react-easy-crop reports, in the source image's own pixels. */
export type CropArea = {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Avatars are only ever shown small. Capping the long edge here means a 12MP
 * phone photo is uploaded as a few tens of KB instead of several MB, which is
 * the difference between a snappy save and a stalled one on mobile data.
 */
const OUTPUT_SIZE = 512

/** JPEG quality for the exported crop — visually clean, comfortably small. */
const QUALITY = 0.9

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", () =>
      reject(new Error("That image could not be read."))
    )
    image.src = src
  })
}

function context2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("Your browser could not process that image.")
  }
  return ctx
}

/**
 * Paint the image onto a canvas at the given rotation.
 *
 * The crop box the cropper reports is expressed against the *rotated* picture,
 * so the rotation has to be baked in before the box means anything. Skipping
 * this step silently crops the wrong region as soon as anyone uses Rotate — the
 * numbers still look plausible, which is what makes it easy to miss.
 */
function drawRotated(
  image: HTMLImageElement,
  rotation: number
): HTMLCanvasElement {
  const radians = (rotation * Math.PI) / 180
  const { width, height } = image

  // Bounding box of the rotated image, so nothing is clipped at 90°.
  const sin = Math.abs(Math.sin(radians))
  const cos = Math.abs(Math.cos(radians))
  const boxWidth = Math.floor(width * cos + height * sin)
  const boxHeight = Math.floor(width * sin + height * cos)

  const canvas = document.createElement("canvas")
  canvas.width = boxWidth
  canvas.height = boxHeight

  const ctx = context2d(canvas)
  ctx.translate(boxWidth / 2, boxHeight / 2)
  ctx.rotate(radians)
  ctx.drawImage(image, -width / 2, -height / 2)

  return canvas
}

/**
 * Render the chosen crop to a square JPEG.
 *
 * The crop happens in the browser rather than on the server, so what the user
 * saw in the circle is exactly the bytes that get uploaded — no second guess
 * about focal point, and nothing larger than needed crosses the network.
 *
 * The output is always square and always `OUTPUT_SIZE`, so every avatar in the
 * system has the same dimensions regardless of what was fed in.
 */
export async function cropToBlob(
  imageSrc: string,
  area: CropArea,
  rotation = 0
): Promise<Blob> {
  const image = await loadImage(imageSrc)
  const source = rotation ? drawRotated(image, rotation) : image

  const canvas = document.createElement("canvas")
  canvas.width = OUTPUT_SIZE
  canvas.height = OUTPUT_SIZE

  const ctx = context2d(canvas)

  // A white ground: JPEG has no alpha, and without this a transparent PNG
  // would export with black behind it.
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE)

  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(
    source,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error("Your browser could not process that image."))
        }
      },
      "image/jpeg",
      QUALITY
    )
  })
}
