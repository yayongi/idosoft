package kr.co.idosoft.intranet.admin.model.service;

import java.util.List;
import java.util.Map;

public interface CodeService {
	List<Map<String, Object>> getlist();
	int getlistCount();
}
