package kr.co.idosoft.intranet.resource.service;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.idosoft.intranet.member.model.dao.MemberDaoImpl;
import kr.co.idosoft.intranet.resource.dao.ResourceDaoImpl;
import kr.co.idosoft.intranet.resource.vo.ResourceVO;

/**
 * 
 * @author 김준선
 * @since 2020.03.25
 * @content Resource Service implements
 */
@Service
public class ResourceServiceImpl implements ResourceService{
	
	@Autowired
	private ResourceDaoImpl resDao;
	
	private static final Logger logger = LoggerFactory.getLogger(ResourceServiceImpl.class);
	/**
	 * 자원 등록
	 */
	@Override
	public void inputResource(ResourceVO resourceVO) {
		resDao.insert(resourceVO);
	}
	/**
	 * 자원 수정
	 * @return int
	 */
	@Override
	public int modifyResource(ResourceVO resourceVO) {
		return resDao.update(resourceVO);
	}
	/**
	 * 자원 삭제
	 * @return int
	 */
	@Override
	public int deleteResource(int res_no) {
		return resDao.delete(res_no);
	}
	/**
	 * 자원 선택 삭제
	 * @return int
	 */
	@Override
	@Transactional
	public void deleteResourceList(Map<String, List<Integer>> selectedResNo) {
		resDao.deleteList(selectedResNo);
	}
	/**
	 * 자원번호로 자원정보 가져오기
	 * @return ResourceVO
	 */
	@Override
	public ResourceVO findResource(int res_no) {
		return resDao.select(res_no);
	}
	/**
	 * 검색조건으로 자원리스트 조회
	 * @return List<ResourceVO>
	 */
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
	/**
	 * 검색조건으로 자원리스트 카운트
	 * @return int
	 */
	@Override
	public int getListCount(Map<String, Object> searchData) {
		Map<String,String> newMap =new HashMap<String,String>();
		for(String str : searchData.keySet()) {
			newMap.put(str, String.valueOf(searchData.get(str)));
		}
		return resDao.allCount(newMap);
	}
	/**
	 * 코드 정보 조회
	 * @return List<Object>
	 */
	@Override
	public List<Object> getCode(String code_id) {
		return resDao.getCode(code_id);
	}
	/**
	 * 코드명, 코드번호 및 멤버이름, 멤버번호 조회
	 * @return List<Object>
	 */
	@Override
	@Transactional
	public Map<String, List<Object>> getSelectType(Map<String, String> upper_codes, boolean isAdmin, String memberNo) {
		
		Map<String, List<Object>> resSelectType = new HashMap<>();
		
		for(String key : upper_codes.keySet() ) {
			List<Object> codes = resDao.getCode(upper_codes.get(key));
			resSelectType.put(key, codes);
		}
		List<Object> holders = resDao.getHolders(isAdmin, memberNo);
		resSelectType.put("resHolderData", holders);
		
		return resSelectType;
	}
	/**
	 * 검색조건으로 엑셀출력용 데이터 조회
	 * @return List<LinkedHashMap<String, Object>>
	 */
	@Override
	public List<LinkedHashMap<String, Object>> exportExcel(HashMap<String,String> data) {
		return resDao.exportExcel(data);
	}
}
