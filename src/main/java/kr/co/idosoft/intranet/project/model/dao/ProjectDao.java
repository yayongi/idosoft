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
	void deleteInfo(int project_no);
	HashMap<String, Object> selectInfo(int project_no);
	List<Map<String, Object>> selectList(HashMap<String, Object> condition);
	String selectMaxProject();
	List<Map<String, Object>> selectAllList();
	
	void insert_member(HashMap<String, Object> insert);
}

