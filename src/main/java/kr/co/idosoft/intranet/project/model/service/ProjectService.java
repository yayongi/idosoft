package kr.co.idosoft.intranet.project.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface ProjectService {
	void insert(HashMap<String, Object> insert);
	void update(HashMap<String, Object> update);
	void deleteInfo(int project_no);
	HashMap<String, Object> selectInfo(int project_no);
	List<Map<String, Object>> selectList(HashMap<String, Object> condition);
	String selectMaxProject();
	List<Map<String, Object>> selectAllList();
	
	
	
	void insertProjectMember(HashMap<String, Object> insert);
}
