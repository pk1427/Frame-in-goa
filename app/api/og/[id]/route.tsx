import { ImageResponse } from "@vercel/og";
import { getCard, getCombined } from "@/lib/store/shareStore";
import { colors, layout } from "@/lib/render/theme";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";

const imbueBold = readFile(
  join(process.cwd(), "public/fonts/imbue-700.woff2")
);
const victorMonoRegular = readFile(
  join(process.cwd(), "public/fonts/victor-mono-400.woff2")
);
const victorMonoBold = readFile(
  join(process.cwd(), "public/fonts/victor-mono-700.woff2")
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [cardRecord, combinedRecord] = await Promise.all([
    getCard(id),
    getCombined(id),
  ]);
  const record = cardRecord || combinedRecord;
  if (!record) {
    return new Response("Not found", { status: 404 });
  }

  const [imbueData, victorMonoRegularData, victorMonoBoldData] =
    await Promise.all([imbueBold, victorMonoRegular, victorMonoBold]);

  const width = layout.cardWidth;
  const height =
    record.mode === "pfp" ? layout.pfpSize : layout.cardHeight;

  if (record.mode === "pfp") {
    return new ImageResponse(
      (
        <div
          style={{
            width,
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.primary,
            fontFamily: "VictorMono",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={record.photoDataUrl}
              width={720}
              height={720}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
              }}
              alt=""
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 780,
                height: 780,
                marginTop: -390,
                marginLeft: -390,
                borderRadius: "50%",
                border: "16px solid #FEE101",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 860,
                height: 860,
                marginTop: -430,
                marginLeft: -430,
                borderRadius: "50%",
                border: "8px dashed #E91E63",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                fontSize: 64,
              }}
            >
              🌴
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 120,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              fontFamily: "Imbue",
              fontWeight: 700,
              fontSize: 48,
              color: colors.accent,
            }}
          >
            #FRAMEINGOA
           </div>
         </div>
      ),
      {
        width,
        height,
        fonts: [
          {
            name: "Imbue",
            data: imbueData,
            weight: 700,
          },
          {
            name: "VictorMono",
            data: victorMonoBoldData,
            weight: 700,
          },
          {
            name: "VictorMono",
            data: victorMonoRegularData,
            weight: 400,
          },
        ],
      }
    );
  }

  if (record.mode === "combined") {
    const photos = (record as { photoDataUrls?: string[] }).photoDataUrls || [];
    const photoCount = photos.length;
    const cols = photoCount === 1 ? 1 : 2;
    const rows = Math.ceil(photoCount / cols);
    const padding = 80;
    const gap = 40;
    const photoWidth =
      (width - padding * 2 - gap * (cols - 1)) / cols;
    const photoHeight =
      (height - padding * 2 - gap * (rows - 1)) / rows;

    const photoElements = photos.map((src, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = padding + col * (photoWidth + gap);
      const y = padding + row * (photoHeight + gap);
      return (
        <img
          key={index}
          src={src}
          style={{
            position: "absolute",
            top: y,
            left: x,
            width: photoWidth,
            height: photoHeight,
            borderRadius: 24,
            objectFit: "cover",
            border: "8px solid #FEE101",
          }}
          alt=""
        />
      );
    });

    return new ImageResponse(
      (
        <div
          style={{
            width,
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.primary,
            fontFamily: "VictorMono",
          }}
        >
          <div
            style={{
              position: "relative",
              width,
              height,
            }}
          >
            {photoElements}
            <div
              style={{
                position: "absolute",
                bottom: 60,
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: "Imbue",
                fontWeight: 700,
                fontSize: 36,
                color: colors.accent,
              }}
            >
              #FRAMEINGOA
           </div>
         </div>
        </div>
      ),
      {
        width,
        height,
        fonts: [
          {
            name: "Imbue",
            data: imbueData,
            weight: 700,
          },
          {
            name: "VictorMono",
            data: victorMonoRegularData,
            weight: 400,
          },
        ],
      }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.primary,
          fontFamily: "VictorMono",
        }}
      >
        <div
          style={{
            position: "relative",
            width,
            height,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 48,
              left: 48,
              right: 48,
              bottom: 48,
              borderRadius: 24,
              backgroundColor: colors.offwhite,
            }}
          />

          <img
            src={record.photoDataUrl}
            alt=""
            style={{
              position: "absolute",
              top: 100,
              left: 260,
              width: 680,
              height: 680,
              borderRadius: 24,
              objectFit: "cover",
              border: "8px solid #FEE101",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: 840,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: "Imbue",
              fontWeight: 700,
              fontSize: 64,
              color: colors.ink,
            }}
          >
            {record.name || "Your Name"}
          </div>

          <div
            style={{
              position: "absolute",
              top: 900,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: "VictorMono",
              fontWeight: 400,
              fontSize: 36,
              color: colors.accent,
            }}
          >
            {record.stack || "Stack / Role"}
          </div>

          <div
            style={{
              position: "absolute",
              top: 1040,
              left: "50%",
              transform: "translateX(-50%)",
              width: 320,
              height: 320,
              borderRadius: "50%",
              border: "8px dashed #E91E63",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontFamily: "VictorMono",
                fontWeight: 700,
                fontSize: 40,
                color: colors.ink,
                textAlign: "center",
                padding: 40,
                wordBreak: "break-word",
              }}
            >
              {record.builderClass || "Builder Class"}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 60,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: "Imbue",
              fontWeight: 700,
              fontSize: 36,
              color: colors.accent,
            }}
          >
            #FRAMEINGOA
          </div>
        </div>
      </div>
    ),
    {
      width,
      height,
      fonts: [
        {
          name: "Imbue",
          data: imbueData,
          weight: 700,
        },
        {
          name: "VictorMono",
          data: victorMonoRegularData,
          weight: 400,
        },
        {
          name: "VictorMono",
          data: victorMonoBoldData,
          weight: 700,
        },
      ],
    }
  );
}
