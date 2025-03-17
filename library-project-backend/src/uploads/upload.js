import fastifyMultipart from "@fastify/multipart";
import cloudinary from "../../config/cloudinary.js";
import db from "../../db.js";

export default async function uploadRoutes(fastify) {
  fastify.register(fastifyMultipart);

  fastify.post("/upload-image", async (req, reply) => {
    try {
      const data = await req.file();
      if (!data) return reply.code(400).send({ error: "No file uploaded" });

      const fileBuffer = await data.toBuffer();

      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, uploadResult) => {
            if (error) return reject(error);
            resolve(uploadResult);
          }
        );
        uploadStream.end(fileBuffer);
      });

      const uploadResult = await uploadPromise;
      const [imageId] = await db("images").insert({
        url: uploadResult.secure_url,
      });

      return reply.send({ imageId, url: uploadResult.secure_url });
    } catch (error) {
      console.error("Upload Error:", error);
      return reply.code(500).send({ error: "Internal Server Error" });
    }
  });

  fastify.delete("/delete-image/:id", async (req, reply) => {
    try {
      const { id } = req.params;

      // Tìm ảnh trong database
      const image = await db("images").where("id", id).first();
      if (!image) return reply.code(404).send({ error: "Image not found" });

      // Xóa ảnh trên Cloudinary
      const cloudinaryPublicId = image.url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(cloudinaryPublicId);

      // Xóa ảnh trong database
      await db("images").where("id", id).del();

      return reply.send({ success: true });
    } catch (error) {
      console.error("Delete Image Error:", error);
      return reply.code(500).send({ error: "Internal Server Error" });
    }
  });
}
