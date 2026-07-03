import { useState, useEffect } from 'react';
import { createProject, getProjects } from './api/projectApi';

function App() {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [projects, setProjects] = useState([]);

  const handleChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // 프로젝트 등록
  const handleAdd = async () => {
    if(projectName.trim() === '') {
      alert('프로젝트명을 입력해주세요.');
      return;
    }

    if(!confirm('프로젝트를 추가하시겠습니까?')) return;

    try {
      const response = await createProject(projectName, description);
      console.log('프로젝트 생성 성공:', response.data);
      alert('프로젝트가 성공적으로 생성되었습니다.');
      setProjectName('');
    } catch (error) {
      console.error('프로젝트 생성 실패:', error);
      alert('프로젝트 생성에 실패했습니다.');
    }
  };

  // 프로젝트 조회
  const loadProjects = async () => {
    
  try {
    const response = await getProjects();
    console.log(response.data);
    console.log(Array.isArray(response.data));
    setProjects(response.data.content);
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="container">

      <h1>React Project Tracker</h1>

      <div>

        <input
          type="text"
          placeholder="프로젝트명 입력"
          value={projectName}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="설명 입력"
          value={description}
          onChange={handleDescriptionChange}
        />

        <button onClick={handleAdd}>
          추가
        </button>

      </div>

      <table border="1">
      <thead>
        <tr>
          <th>No</th>
          <th>프로젝트명</th>
          <th>설명</th>
        </tr>
      </thead>

      <tbody>

        {projects.map((project) => (
          <tr key={project.id}>
            <td>{project.id}</td>
            <td>{project.name}</td>
            <td>{project.description}</td>
          </tr>
        ))}

      </tbody>
    </table>

    </div>
  )
}

export default App
