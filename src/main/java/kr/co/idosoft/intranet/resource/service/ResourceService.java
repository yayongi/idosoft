package kr.co.idosoft.intranet.resource.service;

import java.util.List;
import java.util.Map;

import kr.co.idosoft.intranet.resource.vo.ResourceVO;

public interface ResourceService {
	
	void inputResource(ResourceVO resourceVO); 
	
	int modifyResource(ResourceVO resourceVO);
	
	int deleteResource(int res_no);
	
	void deleteResourceList(List<Integer> selectedResNo); 
	
	ResourceVO findResource(int res_no); 
	
	List<ResourceVO> findResourceList(Map<String, Object> data);

	List<Object> getCode(String code_id);

	int getListCount(Map<String, Object> searchData);
	
	Map<String, List<Object>> getSelectType(Map<String, String> upper_codes);


	
}