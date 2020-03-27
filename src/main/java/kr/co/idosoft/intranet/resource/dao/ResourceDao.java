package kr.co.idosoft.intranet.resource.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import kr.co.idosoft.intranet.member.vo.MemberVO;
import kr.co.idosoft.intranet.resource.vo.ResourceVO;

@Repository
public interface ResourceDao {
	void insert(ResourceVO resourceVO);
	int update(ResourceVO resourceVO);
	int delete(int res_no);
	ResourceVO select(int res_no);
	List<ResourceVO> selectList();
	List<Object> getCode(String code_id);
	List<Object> getHolders();
}
