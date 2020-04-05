package kr.co.idosoft.intranet.resource.dao;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import kr.co.idosoft.intranet.member.vo.MemberVO;
import kr.co.idosoft.intranet.resource.vo.ResourceVO;

/**
 * 
 * @author 김준선
 * @since 2020.03.25
 * @content Resource DAO
 */
@Repository
public interface ResourceDao {
	/**
	 * 자원 등록
	 */
	void insert(ResourceVO resourceVO);
	/**
	 * 자원 수정
	 * @return int
	 */
	int update(ResourceVO resourceVO);
	/**
	 * 자원 삭제
	 * @return int
	 */
	int delete(int res_no);
	/**
	 * 자원번호로 자원정보 가져오기
	 * @return ResourceVO
	 */
	ResourceVO select(int res_no);
	/**
	 * 검색조건으로 자원리스트 가져오기
	 * @return List<ResourceVO>
	 */
	List<ResourceVO> selectList(Map<String,Object> data);
	/**
	 * 검색조건으로 자원리스트 카운트
	 * @return int
	 */
	int allCount(Map<String, String> search);
	/**
	 * 코드 정보 가져오기
	 * @return List<Object>
	 */
	List<Object> getCode(String code_id);
	/**
	 * 멤버 번호, 이름 가져오기
	 * @return List<Object>
	 */
	List<Object> getHolders(boolean isAdmin, String memberNo);
	/**
	 * 검색조건으로 엑셀출력용 데이터 가져오기
	 * @return List<LinkedHashMap<String, Object>>
	 */
	List<LinkedHashMap<String, Object>> exportExcel(HashMap<String,String> data);
	/**
	 * 자원 선택 삭제
	 * @return int
	 */
	int deleteList(Map<String, List<Integer>> data);
}
