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
	
	//자원등록
	@Override
	public void inputResource(ResourceVO resourceVO) {
		resDao.insert(resourceVO);
	}
	//자원수정
	@Override
	public int modifyResource(ResourceVO resourceVO) {
		return resDao.update(resourceVO);
	}
	//자원삭제
	@Override
	public int deleteResource(int res_no) {
		return resDao.delete(res_no);
	}
	//자원선택 삭제
	@Override
	@Transactional
	public void deleteResourceList(List<Integer> selectedResNo) {
		for(int i : selectedResNo) {
			resDao.delete(i);
		}
	}
	//자원 조회
	@Override
	public ResourceVO findResource(int res_no) {
		return resDao.select(res_no);
	}
	//자원 리스트 조회
	@Override
	public List<ResourceVO> findResourceList(Map<String, Object> data){
		
		Map<String, Object> searchData = (Map<String, Object>) data.get("state");
		
		Map<String,Object> newMap =new HashMap<String,Object>();
		for(String str : searchData.keySet()) {
			newMap.put(str, String.valueOf(searchData.get(str)));
		}
		newMap.put("offset", (Integer)data.get("page")*(Integer)data.get("rowsPerPage"));
		newMap.put("limit", data.get("rowsPerPage"));
		return resDao.selectList(newMap);
	}
	//자원 리스트 카운트
	@Override
	public int getListCount(Map<String, Object> searchData) {
		Map<String,String> newMap =new HashMap<String,String>();
		for(String str : searchData.keySet()) {
			newMap.put(str, String.valueOf(searchData.get(str)));
		}
		return resDao.allCount(newMap);
	}
	//코드정보 조회
	@Override
	public List<Object> getCode(String code_id) {
		return resDao.getCode(code_id);
	}
	//코드명, 코드번호 및 멤버이름, 멤버번호 조회
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
