package kr.co.idosoft.intranet.resource.service;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.idosoft.intranet.member.model.dao.MemberDaoImpl;
import kr.co.idosoft.intranet.resource.dao.ResourceDaoImpl;
import kr.co.idosoft.intranet.resource.vo.ResourceVO;

@Service
public class ResourceServiceImpl implements ResourceService{
	
	@Autowired
	private ResourceDaoImpl resDao;
	
	private static final Logger logger = LoggerFactory.getLogger(ResourceServiceImpl.class);
	
	@Override
	public void inputResource(ResourceVO resourceVO) {
		resDao.insert(resourceVO);
	}
	
	public int modifyResource(ResourceVO resourceVO) {
		return resDao.update(resourceVO);
	}
	
	public int deleteResource(int res_no) {
		return resDao.delete(res_no);
	}
	@Override
	@Transactional
	public void deleteResourceList(List<Integer> selectedResNo) {
		for(int i : selectedResNo) {
			resDao.delete(i);
		}
	}
	
	public ResourceVO findResource(int res_no) {
		return resDao.select(res_no);
	}
	
	public List<ResourceVO> findResourceList(){
		return resDao.selectList();
	}

	@Override
	public List<Object> getCode(String code_id) {
//		return resDao.getCode(code_id);
		return null;
	}
	
	@Override
	@Transactional
	public Map<String, List<Object>> getSelectType(Map<String, String> upper_codes) {
		
		Map<String, List<Object>> resSelectType = new HashMap<>();
		
		for(String key : upper_codes.keySet() ) {
			List<Object> codes = resDao.getCode(upper_codes.get(key));
			resSelectType.put(key, codes);
		}
		List<Object> holders = resDao.getHolders();
		resSelectType.put("resHolderData", holders);
		
		return resSelectType;
	}
	
}
