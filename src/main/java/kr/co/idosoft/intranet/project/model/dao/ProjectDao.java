package kr.co.idosoft.intranet.project.model.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * @author 송원회
 * @since 2020.03.09
 * @content Project DAO
 */
public interface ProjectDao {
	void insert(HashMap<String, Object> insert);
	void update(HashMap<String, Object> update);
	void deleteInfo(String project_no);
	HashMap<String, Object> selectInfo(String project_no);
	String selectMaxProject();
	List<Map<String, Object>> selectAllList(HashMap<String, Object> condition);
	List<Map<String, Object>> selectForList(HashMap<String, Object> condition);

	
	List<Map<String, Object>> projectMemberList(String project_no);
	void insert_member(HashMap<String, Object> insert);
	void removeMember(HashMap<String, Object> info);
	void updateMember(HashMap<String, Object> member);
	void removeMemberForPro(String project_no);
	//현재 진행중인 프로젝트
	public List<HashMap<String, String>> getPresentProject();
	//프로젝트 개인이력 
	public List<HashMap<String,String>> getProjectMember();
	public List<HashMap<String,Object>> getGraphInfo(HashMap<String, Object> condition);
	public List<HashMap<String,Object>> getGraphForInfo(HashMap<String, Object> condition);
	
	
	//교통 운행비
	void traffic_insert(HashMap<String, Object> insert);
	void traffic_update(HashMap<String, Object> update);
	void traffic_delete(HashMap<String, Object> delete);
	void traffic_delete_all(HashMap<String, Object> delete);
	public List<HashMap<String,Object>> getSelectTraffic(HashMap<String, Object> condition);
}

