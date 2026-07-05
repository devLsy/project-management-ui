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
      setDescription('');
      loadProjects();
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
      <div className="min-h-screen bg-slate-100 p-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-10">
            React Project Tracker
          </h1>

          {/* 입력 영역 */}
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <div className="flex gap-4">
              <input
                className="flex-1 border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="프로젝트명 입력"
                value={projectName}
                onChange={(e)=>setProjectName(e.target.value)}
              />
              <input
                className="flex-1 border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="설명 입력"
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
              />
              <button
                onClick={handleAdd}
                className="w-44 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                + 추가
              </button>
            </div>
          </div>

          {/* 리스트 */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr className="text-blue-900">
                  <th className="p-5 w-24">No</th>
                  <th className="text-left">프로젝트명</th>
                  <th className="text-left">설명</th>
                  <th className="w-48">등록일</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p,index)=>(
                  <tr
                    key={p.id}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="text-center py-6">
                      #{p.id ?? index+1}
                    </td>
                    <td className="font-semibold">
                      {p.name}
                    </td>
                    <td className="text-gray-500">
                      {p.description}
                    </td>
                    <td className="text-center text-gray-500">
                      {p.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div className="flex justify-between items-center p-6">
              <div className="text-gray-600">
                전체 <span className="font-bold">{projects.length}</span>건
              </div>

              {/* 페이지네이션 */}
              <div className="flex gap-2">
                <button className="border border-slate-200 rounded-xl px-4 py-3 text-slate-400 bg-white hover:bg-slate-50">
                  &lt;
                </button>
                <button className="bg-blue-600 text-white rounded-xl px-5 py-3 font-semibold shadow">
                  1
                </button>
                <button className="border border-slate-200 rounded-xl px-4 py-3 text-slate-400 bg-white hover:bg-slate-50">
                  &gt;
                </button>
              </div>
              <select className="border border-slate-200 rounded-xl px-5 py-3 bg-white text-slate-700">
                <option>10개씩 보기</option>
                <option>20개씩 보기</option>
                <option>50개씩 보기</option>
              </select>
            </div>
          </div>
        </div>
      </div>
  );
}

export default App
