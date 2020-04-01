package kr.co.idosoft.intranet.project.model.service;

import java.util.HashMap;
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
	List<Map<String, Object>> selectAllList();
	
	//코드 정보 조회
	List<Map<String, Object>> getLowCodeList(String code_id);
}
