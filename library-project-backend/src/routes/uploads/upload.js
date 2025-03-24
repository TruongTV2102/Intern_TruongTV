import fastifyMultipart from "@fastify/multipart";
import cloudinary from "../../config/cloudinary.js";
import { authenticate } from "../login/auth.js";

async function uploadRoutes(fastify) {
  fastify.register(fastifyMultipart);

  // Hàm upload ảnh lên Cloudinary
  const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      );
      uploadStream.end(fileBuffer);
    });
  };

  // API Upload Ảnh
  fastify.post(
    "/upload-image",
    {
      preValidation: [authenticate],
    },
    async (req, reply) => {
      const data = await req.file();
      if (!data) throw new Error("Không có file upload");

      const fileBuffer = await data.toBuffer();
      const uploadResult = await uploadToCloudinary(fileBuffer);

      return reply.send({ url: uploadResult.secure_url });
    }
  );

  // API Xóa Ảnh
  fastify.delete(
    "/delete-image/:publicId",
    {
      preValidation: [authenticate],
    },
    async (req, reply) => {
      const { publicId } = req.params;
      await cloudinary.uploader.destroy(publicId);
      return reply.send({ success: true });
    }
  );
}

export default uploadRoutes;
