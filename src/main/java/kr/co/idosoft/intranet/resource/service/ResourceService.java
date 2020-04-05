package kr.co.idosoft.intranet.resource.service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import kr.co.idosoft.intranet.resource.vo.ResourceVO;
/**
 * 
 * @author 김준선
 * @since 2020.03.25
 * @content Resource Service
 */
@Service
public interface ResourceService {
	/**
	 * 자원 등록
	 */
	void inputResource(ResourceVO resourceVO); 
	/**
	 * 자원 수정
	 * @return int
	 */
	int modifyResource(ResourceVO resourceVO);
	/**
	 * 자원 삭제
	 * @return int
	 */
	int deleteResource(int res_no);
	/**
	 * 자원 선택 삭제
	 * @return int
	 */
	void deleteResourceList(Map<String, List<Integer>> selectedResNo); 
	/**
	 * 자원번호로 자원정보 가져오기
	 * @return ResourceVO
	 */
	ResourceVO findResource(int res_no); 
	/**
	 * 검색조건으로 자원리스트 조회
	 * @return List<ResourceVO>
	 */
	List<ResourceVO> findResourceList(Map<String, Object> data);
	/**
	 * 코드 정보 조회
	 * @return List<Object>
	 */
	List<Object> getCode(String code_id);
	/**
	 * 검색조건으로 자원리스트 카운트
	 * @return int
	 */
	int getListCount(Map<String, Object> searchData);
	/**
	 * 코드명, 코드번호 및 멤버이름, 멤버번호 조회
	 * @return List<Object>
	 */
	Map<String, List<Object>> getSelectType(Map<String, String> upper_codes, boolean isAdmin, String memberNo);
	/**
	 * 검색조건으로 엑셀출력용 데이터 조회
	 * @return List<LinkedHashMap<String, Object>>
	 */
	List<LinkedHashMap<String, Object>> exportExcel(HashMap<String,String> data);


	
}