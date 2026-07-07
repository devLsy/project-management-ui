import { useState, useEffect, useRef } from 'react';
import { createProject, getProjects, getProjectDetails, updateProject } from './api/projectApi';

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // 검색
  const [searchType, setSearchType] = useState('name');
  const [keyword, setKeyword] = useState('');

  // 등록 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');

  // 페이징
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const projectNameRef = useRef(null);

  // 프로젝트 조회
  const loadProjects = async (nextPage = page, nextSize = pageSize) => {
    try {
      const response = await getProjects(keyword, nextPage, nextSize);

      setProjects(response.data.content);
      setPage(response.data.page);
      setPageSize(response.data.size);
      setTotalElements(response.data.totalElements);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('프로젝트 조회 실패:', error);
      setProjects([]);
    }
  };

  // 프로젝트 상세 조회
  const loadProjectDetails = async (projectId) => { 
    try {
      const response = await getProjectDetails(projectId);  
      setSelectedProjectId(response.data.id);
      setProjectName(response.data.name);
      setDescription(response.data.description);
      setIsModalOpen(true); 
    } catch (error) {
      console.error('프로젝트 상세 조회 실패:', error);
      throw error;
    }
  };

    useEffect(() => {
      loadProjects();
  }, []);

    // 모달 열기
  const openModal = () => {
    setSelectedProjectId(null);
    setProjectName('');
    setDescription('');
    setIsModalOpen(true);
  };

    // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 프로젝트 등록
  const handleAdd = async () => {
    if(projectName.trim() === '') {
      alert('프로젝트명을 입력해주세요.');
      projectNameRef.current?.focus();
      return;
    }

    if(!confirm('저장 하시겠습니까?')) return;

    try {

      const project = {
        projectName,
        description,
      };

      if (selectedProjectId === null) {
        await createProject(project);
      } else {
        await updateProject(selectedProjectId, project);
      }

      alert('저장되었습니다.');
      closeModal();
      loadProjects();
    } catch (error) {
      console.error('프로젝트 생성 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

   return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* 상단 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            React Project Tracker
          </h1>
        </div>

        {/* 검색 영역 */}
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <div className="flex gap-3">
            <select
              className="w-36 border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-700"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="">전체</option>
              <option value="name">이름</option>
              <option value="description">설명</option>
            </select>

            <input
              className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="검색어를 입력하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  loadProjects(0, pageSize);
                }
              }}
            />

            <button
              onClick={() => loadProjects(0, pageSize)}
              className="w-24 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-900"
            >
            조회
            </button>

            <button
              onClick={openModal}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
            등록
            </button>
          </div>
        </div>

        {/* 리스트 */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-50">
              <tr className="text-blue-900">
                <th className="p-4 w-20">No</th>
                <th className="p-4 text-left">프로젝트명</th>
                <th className="p-4 text-left">설명</th>
                <th className="p-4 w-44">등록일</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((p, index) => (
                <tr
                  key={p.id ?? index}
                  onClick={() => loadProjectDetails(p.id)}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="p-4 text-center text-slate-500">
                    #{page * pageSize + index + 1}
                  </td>

                  <td className="p-4 font-semibold text-slate-800">
                    {p.name}
                  </td>

                  <td className="p-4 text-slate-500">
                    {p.description || '-'}
                  </td>

                  <td className="p-4 text-center text-slate-500">
                    {p.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div className="flex justify-between items-center p-4">
            <div className="text-sm text-slate-600">
              전체 <span className="font-bold">{totalElements}</span>건
            </div>

            {/* 페이지네이션 */}
            <div className="flex gap-2">
              <button
                className="btn-page"
                disabled={page === 0}
                onClick={() => loadProjects(page - 1, pageSize)}
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => loadProjects(index, pageSize)}
                  className={page === index ? "btn-page btn-page-active" : "btn-page"}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="btn-page"
                disabled={page >= totalPages - 1}
                onClick={() => loadProjects(page + 1, pageSize)}
              >
                &gt;
              </button>
            </div>

            <select
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-700"
              value={pageSize}
              onChange={(e) => {
                const size = Number(e.target.value);
                loadProjects(0, size);
              }}
            >
              <option value={10}>10개씩 보기</option> 
              <option value={20}>20개씩 보기</option>
              <option value={50}>50개씩 보기</option>
            </select>
          </div>
        </div>
      </div>

      {/* 등록 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-semibold">
                {selectedProjectId === null ? '프로젝트 등록' : '프로젝트 수정'}
              </h2>

              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  프로젝트명
                </label>

                <input
                  ref={projectNameRef}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="프로젝트명을 입력하세요"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  설명
                </label>

                <textarea
                  className="w-full h-28 resize-none border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="설명을 입력하세요"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                onClick={closeModal}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                취소
              </button>

              <button
                onClick={handleAdd}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App
