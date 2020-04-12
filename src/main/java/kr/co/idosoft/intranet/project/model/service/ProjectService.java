package kr.co.idosoft.intranet.project.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import kr.co.idosoft.intranet.member.vo.MemberVO;

public interface ProjectService {
	void insert(HashMap<String, Object> insert);
	void update(HashMap<String, Object> update);
	void deleteInfo(String project_no);
	HashMap<String, Object> selectInfo(String project_no);
	List<Map<String, Object>> selectList(HashMap<String, Object> condition);
	String selectMaxProject();
	List<Map<String, Object>> selectAllList(HashMap<String, Object> condition);
	
	
	
	void insertProjectMember(HashMap<String, Object> insert);
	List<Map<String, Object>> projectMemberList(String project_no);
	void removeMember(HashMap<String, Object> info);
	void updateMember(HashMap<String, Object> member);
	void removeMemberForPro(String project_no);
	
	//현재 진행중인 프로젝트
	public List<HashMap<String, String>> getPresentProject();
	
	//프로젝트 개인이력 
	public List<HashMap<String,String>> getProjectMember();
	
	//하위 코드 조회
	List<Map<String, Object>> getLowCodeList(String code_id);
	
	// 사원 리스트 호출
	public List<MemberVO> selectMemberList();
	
	List<Map<String, Object>> selectForList(HashMap<String, Object> condition);
	
	public List<HashMap<String,Object>> getGraphInfo(HashMap<String, Object> condition);
	public List<HashMap<String,Object>> getGraphForInfo(HashMap<String, Object> condition);
	
	
	//교통 운행비
	void traffic_insert(HashMap<String, Object> insert);
	void traffic_update(HashMap<String, Object> update);
	void traffic_delete(HashMap<String, Object> delete);
	void traffic_delete_all(HashMap<String, Object> delete);
	public List<HashMap<String,Object>> getSelectTraffic(HashMap<String, Object> condition);
	
	
}
