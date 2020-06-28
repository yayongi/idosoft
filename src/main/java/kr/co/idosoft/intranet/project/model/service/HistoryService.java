package kr.co.idosoft.intranet.project.model.service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import kr.co.idosoft.intranet.member.vo.MemberVO;

public interface HistoryService {
	void insert(HashMap<String, Object> insert);
	List<Map<String, Object>> selectHistory(String member_no);
	
	// 사원 리스트 호출
	List<LinkedHashMap<String,Object>> memberList();
	
	// 프로젝트 - 프로젝트 리스트 불러오기
	List<Map<String, Object>> selectAllList(HashMap<String, Object> condition);
	
	//코드 정보 조회
	List<Map<String, Object>> getLowCodeList(String code_id);
	
	//이력 상세 화면
	LinkedHashMap<String, Object> getinfo(LinkedHashMap<String,Object> data);
	
	//직무 가져오기
	List<LinkedHashMap<String, Object>> getrolelist();

	//특정 연도 프로젝트 가져오기
	List<Map<String,Object>> getProjectList(Map<String, Object> data);
	
	//프로젝트 업체 가져오기
	LinkedHashMap<String, Object> getcompany(LinkedHashMap<String,Object> data);
	
	//개인 이력 수정하기
	void update(LinkedHashMap<String,Object> data);
	
	//개인 이력 삭제하기
	void remove(LinkedHashMap<String,Object> data);
	
	
}
