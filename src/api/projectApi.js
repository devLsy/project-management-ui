import axios from "axios";

const API_URL = "http://localhost:8080/api/projects";

// 등록 API
export const createProject = (projectName, description) => {
    return axios.post(API_URL, {
        projectName: projectName, 
        description: description
    });
}

// 조회 API
export const getProjects = () => {
    return axios.get(API_URL);
}