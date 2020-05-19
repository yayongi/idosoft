package kr.co.idosoft.intranet.project.model.service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import kr.co.idosoft.intranet.member.vo.MemberVO;

public interface HistoryService {
	void insert(HashMap<String, Object> insert);
	void update(HashMap<String, Object> update);
	List<Map<String, Object>> selectHistory(String member_no);
	
	
	// 사원 리스트 호출
	List<MemberVO> selectMemberList();
	
	// 프로젝트 - 프로젝트 리스트 불러오기
	List<Map<String, Object>> selectAllList(HashMap<String, Object> condition);
	
	//코드 정보 조회
	List<Map<String, Object>> getLowCodeList(String code_id);
	
	//이력 상세 화면
	LinkedHashMap<String, Object> getinfo(LinkedHashMap<String,Object> data);
	
	void removeHistory(String mem_hist_no);
}
