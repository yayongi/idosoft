package kr.co.idosoft.intranet.admin.model.dao;

import java.util.List;
import java.util.Map;

/**
 * 
 * @author 송원회
 * @since 2020.03.09
 * @content Code DAO
 */
public interface CodeDao {
	void insert(Map<String, Object> insert);
	void update(Map<String, Object> update);
	void deleteInfo(String code_id);
	List<Map<String, Object>> getlist();
	int getlistCount();
	List<Map<String, Object>> getLowCodeList(String code_id);
}

