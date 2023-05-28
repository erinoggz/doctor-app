import { useState } from "react";

const useFileUpload = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const uploadImage: any = async (file: any) => {
    setLoading(true);
    const formData = new FormData();

    formData.append('upload_preset', 'h4vchavb');
    formData.append("file", file[0]);

    const data = await fetch(`${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL}`, {
      method: "POST",
      body: formData,
    }).then((r) => r.json());

    setData(data);
    setLoading(false);
  };

  return [{ data, loading }, uploadImage];
};

export default useFileUpload;
