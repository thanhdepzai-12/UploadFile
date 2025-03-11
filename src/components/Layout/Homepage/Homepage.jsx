import React, { useState, useEffect } from "react";
import { Card } from "antd";

import { Button, Modal } from 'antd';
import '../Homepage/Homepage.css'
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import moment from "moment";



const DocumentUpload = (props) => {
const {handleUpload, handleDelete,documents,loading,fileName,handleView,showModal,handleCancel,handleOk,isModalOpen,check,handleBeforeUpload,file} = props



  return (
    <div>
    <Card style={{ maxWidth: 600, margin: "auto", background: "#1c1c1c", color: "#fff" }}>
      <h2 style={{ color: "#fff" }}>Upload Documents</h2>
        <button className="btn btn-danger w-100" onClick={showModal}> {loading ? "Đang tải..." : "Upload"}
        </button>

        <Modal title="Upload File" open={isModalOpen} >
        <Dragger beforeUpload={handleBeforeUpload}  multiple={true} showUploadList={false}>
            { check ? <div style={{ color: "#fff" }}>{file.name}</div> :
            <div>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text" style={{ color: "#fff" }}>Click or drag file to this area to upload</p>
      <p className="ant-upload-hint" style={{ color: "#fff" }}>Only PDF files are allowed</p>
      </div>
}
    </Dragger>
    <div className="mt-4  d-flex justify-content-end">
        <div className="d-flex gap-2">
            {check ?
            <button className="btn btn-danger" onClick={()=> handleCancel()}>Delete</button>
            : 
            <button className="btn btn-primary" onClick={()=> handleCancel()}>Cancel</button>
            }
            <button className="btn btn-success" onClick={()=> handleOk(file)}>Confirm</button>
            
        </div>
    </div>
      </Modal>
      <h3 className="mt-3" style={{ color: "#fff" }}>Document List</h3>
    <div className="main-list">
        {documents && documents.length > 0 && (
            documents.slice().reverse().map((item, index)=>(
                <div className="list-item mt-3 d-flex align-items-center justify-content-between" key={index}>
                    <span className="h-auto d-flex flex-column align-items-start justify-content-center">
                       <p className="h-auto"> {item.name}</p>
                        <p className="h-auto mt-1" style={{fontSize:"0.4rem"}}>{moment.unix(item.create_time).format("DD-MM-YYYY HH:mm:ss")}  </p>
                    </span>
                    <div className="d-flex gap-2">
                    <button className="btn btn-warning" onClick={()=> handleView(item.web_url)}>view</button>
                        <button className="btn btn-danger" onClick={()=> handleDelete(item)}>Delete</button>
                    </div>
                </div>
            ))
        )}
    </div>
    </Card>
    </div>
  );
};

export default DocumentUpload;
