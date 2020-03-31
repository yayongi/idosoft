package kr.co.idosoft.intranet.resource.dao;

import java.util.LinkedHashMap;
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
	List<ResourceVO> selectList(Map<String,Object> data);
	int allCount(Map<String, String> search);
	List<Object> getCode(String code_id);
	List<Object> getHolders();
	List<LinkedHashMap<String, Object>> exportExcel(List<String> res_no_list);
}
