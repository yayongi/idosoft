package kr.co.idosoft.intranet.project.model.dao;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
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
	
	List<Map<String, Object>> selectHistory(String member_no);
	
	//이력 상세 화면
	LinkedHashMap<String, Object> getinfo(LinkedHashMap<String,Object> data);

	//특정 연도 프로젝트 가져오기
	List<Map<String,Object>> getProjectList(Map<String, Object> data);
	
	void removeHistory(String mem_hist_no);
}

