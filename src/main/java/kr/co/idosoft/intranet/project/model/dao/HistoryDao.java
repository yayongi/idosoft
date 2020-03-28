package kr.co.idosoft.intranet.project.model.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * @author 송원회
 * @since 2020.03.09
 * @content history DAO
 */
public interface HistoryDao {
	void insert(HashMap<String, Object> insert);
	void update(HashMap<String, Object> update);
	void deleteInfo(int mem_hist_no);
	HashMap<String ,Object> selectInfo(int mem_hist_no);
	List<Map<String, Object>> selectList();
	
}

