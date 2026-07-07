import axios from "axios";

const API_URL = "http://localhost:8080/api/projects";

// 등록 API
export const createProject = (project) => {
    return axios.post(API_URL, project);
}

// 조회 API
export const getProjects = (keyword, page = 0, size = 10) => {
  return axios.get(API_URL, {
    params: {
      keyword,
      page,
      size
    },
  });
};

// 상세 조회 API
export const getProjectDetails = (projectId) => {
  return axios.get(`${API_URL}/${projectId}`);
}

// 수정 API
export const updateProject = (projectId, project) => {
  return axios.put(`${API_URL}/${projectId}`, project);
};