package kr.co.idosoft.intranet.project.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface HistoryService {
	void insert(HashMap<String, Object> insert);
	void update(HashMap<String, Object> update);
	void deleteInfo(int mem_hist_no);
	void removeHistoryForPro(String project_no);
	HashMap<String ,Object> selectInfo(int mem_hist_no);
	List<Map<String, Object>> selectList();
}
