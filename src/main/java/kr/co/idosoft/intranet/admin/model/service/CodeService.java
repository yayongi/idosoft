package kr.co.idosoft.intranet.admin.model.service;

import java.util.List;
import java.util.Map;

public interface CodeService {
	void insert(Map<String, Object> insert);
	void update(Map<String, Object> update);
	void deleteInfo(String code_id);
	List<Map<String, Object>> getlist();
	int getlistCount();
	List<Map<String, Object>> getLowCodeList(String code_id);
	
}
