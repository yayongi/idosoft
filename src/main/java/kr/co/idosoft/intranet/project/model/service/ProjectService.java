package kr.co.idosoft.intranet.project.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface ProjectService {
	void insert(HashMap<String, Object> insert);
	void update(HashMap<String, Object> update);
	void deleteInfo(int project_no);
	HashMap<String, Object> selectInfo(String project_no);
	List<Map<String, Object>> selectList(HashMap<String, Object> condition);
	String selectMaxProject();
	List<Map<String, Object>> selectAllList();
	
	
	
	void insertProjectMember(HashMap<String, Object> insert);
	List<Map<String, Object>> projectMemberList(String project_no);
	void removeMember(HashMap<String, Object> info);
	void updateMember(HashMap<String, Object> member);

	//현재 진행중인 프로젝트
	public List<HashMap<String, String>> getPresentProject();
	
	//프로젝트 개인이력 
	public List<HashMap<String,String>> getProjectMember();
	
}
