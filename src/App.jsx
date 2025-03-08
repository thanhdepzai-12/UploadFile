import Homepage from "./components/Layout/Homepage/Homepage";
import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css'
import { message } from "antd";
import { useNavigate } from "react-router-dom";
const App = () => {
  const API_HEADERS = {
    Authorization: "Bearer pat_hZrgsaRObvrRnCbkgK46q1ARKcT1F9a6uhqH3hwkiaUxKYydMRkkdif7MRzvHzkp",
    "Content-Type": "application/json",
    "Agw-Js-Conv": "str",
  };
  const DATASET_ID = "7478901832351432711";
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [check, setCheck]= useState(false);
  const [file, setFile] = useState(null);
  const fetchDocuments = async () => {
    try {
      const { data } = await axios.post(
        "https://api.coze.com/open_api/knowledge/document/list",
        { dataset_id: DATASET_ID },
        { headers: API_HEADERS }
      );
      console.log("API Response:", data.document_infos); // Kiểm tra response API
      if (data) {
        setDocuments(data.document_infos);
      } else {
        message.error("Invalid document list format");
      }
    } catch (error) {
      message.error("Failed to fetch documents");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);
  const handleDelete = async (item) => {
    try {
      await axios.post(
        "https://api.coze.com/open_api/knowledge/document/delete",
        { document_ids: [item.document_id] },
        { headers: API_HEADERS }
      );
      message.success( `${item.name} deleted successfully`);
      fetchDocuments();
    } catch (error) {
      message.error("Failed to delete document");
    }
  };

  const handleUpload = async (file) => {
    if (file.type !== "application/pdf") {
      message.error("Only PDF files are allowed");
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Data = reader.result.split(",")[1];

        await axios.post(
          "https://api.coze.com/open_api/knowledge/document/create",
          {
            dataset_id: DATASET_ID,
            document_bases: [
              {
                name: file.name,
                source_info: {
                  document_source: 0,
                  file_base64: base64Data,
                  file_type: "pdf",
                },
              },
            ],
            chunk_strategy: {
              chunk_type: 0,
            },
          },
          { headers: API_HEADERS }
        );

        message.success(`${file.name} uploaded successfully`);
        setFileName(file.name);
        setCheck(false);
        fetchDocuments();
   
      } catch (error) {
        message.error("Upload failed");
      } finally {
        setLoading(false);
      }
    };
  };
  const handleView = (url)=>{
    if(url){
      window.open(url, "_blank");
    }else {
      message.error("ko thể xem hiện giờ");
    }
  };
  const handleBeforeUpload = (file) => {
    if (file.type !== "application/pdf") {
      message.error("Only PDF files are allowed");
      return false;
    }
    setFile(file); 
    setCheck(true);
    return false; 
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async(file) => {
    await handleUpload(file);
     setIsModalOpen(false);
     setCheck(false);
     setFile(null);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setCheck(false);
    setFile(null)
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center">
      <div className="container">
        <Homepage fetchDocuments={fetchDocuments} 
        check={check}
        handleDelete={handleDelete} 
        handleUpload={handleUpload} 
        documents={documents} 
        setDocuments={setDocuments}
        loading={loading}
        fileName={fileName}
        setFileName={setFileName}
        handleView={handleView}
        showModal={showModal}
        handleOk={handleOk}
        handleCancel={handleCancel}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleBeforeUpload={handleBeforeUpload}
        file={file}
        />
      </div>
    </div>
  );
};

export default App;
