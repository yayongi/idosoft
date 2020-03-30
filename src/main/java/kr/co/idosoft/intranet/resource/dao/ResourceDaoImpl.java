package kr.co.idosoft.intranet.resource.dao;

import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import kr.co.idosoft.intranet.member.vo.MemberVO;
import kr.co.idosoft.intranet.resource.vo.ResourceVO;

@Repository("ResourceDao")
public class ResourceDaoImpl implements ResourceDao {
	
//	private static final Logger LOG = LoggerFactory.getLogger(ResourceDaoImpl.class);
	
	@Autowired
	private SqlSessionTemplate sqlTemplate;
	
	//자원 등록
	@Override
	public void insert(ResourceVO resourceVO) {
		// TODO Auto-generated method stub
		sqlTemplate.insert("resource.insert", resourceVO);
	}
	//자원 수정
	@Override
	public int update(ResourceVO resourceVO) {
		return sqlTemplate.update("resource.update", resourceVO);
	}
	//자원 삭제
	@Override
	public int delete(int res_no) {
		return sqlTemplate.delete("resource.deleteInfo", res_no);
	}
	//자원 선택 삭제
	public int delete(Map<String, List<Integer> > data) {
		return sqlTemplate.delete("resource.deleteList", data);
	}
	//자원 정보 가져오기
	@Override
	public ResourceVO select(int res_no) {
		// TODO Auto-generated method stub
		return sqlTemplate.selectOne("resource.selectInfo", res_no);
	}
	//자원 정보 리스트 가져오기
	@Override
	public List<ResourceVO> selectList(Map<String,Object> data) {
		List<ResourceVO> list = sqlTemplate.selectList("resource.selectList", data);
		return list;
	}
	//자원 정보 리스트 카운트
	@Override
	public int allCount(Map<String, String> searchData) {
		int count = sqlTemplate.selectOne("resource.allCount", searchData);
		return count;
	}
	//코드 가져오기
	@Override
	public List<Object> getCode(String code_id) {
		return sqlTemplate.selectList("resource.getCode",code_id);
	}
	//멤버 가져오기
	@Override
	public List<Object> getHolders() {
		return sqlTemplate.selectList("resource.getHolders");
	}
}
