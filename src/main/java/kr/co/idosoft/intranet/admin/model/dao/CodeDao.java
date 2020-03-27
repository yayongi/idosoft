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
	
	
	List<Map<String, Object>> getlist();
	int getlistCount();
}

