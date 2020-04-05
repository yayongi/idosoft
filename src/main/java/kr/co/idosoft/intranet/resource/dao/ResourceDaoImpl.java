package kr.co.idosoft.intranet.resource.dao;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import kr.co.idosoft.intranet.member.vo.MemberVO;
import kr.co.idosoft.intranet.resource.vo.ResourceVO;

/**
 * 
 * @author 김준선
 * @since 2020.03.25
 * @content Resource DAO implements
 */
@Repository("ResourceDao")
public class ResourceDaoImpl implements ResourceDao {
	
	@Autowired
	private SqlSessionTemplate sqlTemplate;
	
	/**
	 * 자원 등록
	 */
	@Override
	public void insert(ResourceVO resourceVO) {
		// TODO Auto-generated method stub
		sqlTemplate.insert("resource.insert", resourceVO);
	}
	/**
	 * 자원 수정
	 * @return int
	 */
	@Override
	public int update(ResourceVO resourceVO) {
		return sqlTemplate.update("resource.update", resourceVO);
	}
	/**
	 * 자원 삭제
	 * @return int
	 */
	@Override
	public int delete(int res_no) {
		return sqlTemplate.delete("resource.deleteInfo", res_no);
	}
	/**
	 * 자원 선택 삭제
	 * @return int
	 */
	@Override
	public int deleteList(Map<String, List<Integer> > data) {
		return sqlTemplate.delete("resource.deleteList", data);
	}
	/**
	 * 자원번호로 자원정보 조회
	 * @return ResourceVO
	 */
	public ResourceVO select(int res_no) {
		// TODO Auto-generated method stub
		return sqlTemplate.selectOne("resource.selectInfo", res_no);
	}
	/**
	 * 검색조건으로 자원리스트 조회
	 * @return List<ResourceVO>
	 */
	@Override
	public List<ResourceVO> selectList(Map<String,Object> data) {
		List<ResourceVO> list = sqlTemplate.selectList("resource.selectList", data);
		return list;
	}
	/**
	 * 검색조건으로 자원리스트 카운트
	 * @return int
	 */
	@Override
	public int allCount(Map<String, String> searchData) {
		int count = sqlTemplate.selectOne("resource.allCount", searchData);
		return count;
	}
	/**
	 * 코드 정보 조회
	 * @return List<Object>
	 */
	@Override
	public List<Object> getCode(String code_id) {
		return sqlTemplate.selectList("resource.getCode",code_id);
	}
	/**
	 * 멤버 번호, 이름 조회
	 * @return List<Object>
	 */
	@Override
	public List<Object> getHolders(boolean isAdmin, String memberNo) {
		if(isAdmin) {
			return sqlTemplate.selectList("resource.getHolders", null);
		}else{
			return sqlTemplate.selectList("resource.getHolders", memberNo);
		}
	}
	/**
	 * 검색조건으로 엑셀출력용 데이터 조회
	 * @return List<LinkedHashMap<String, Object>>
	 */
	@Override
	public List<LinkedHashMap<String, Object>> exportExcel(HashMap<String,String> data) {
		return sqlTemplate.selectList("resource.exportExcel",data);
	}
}
