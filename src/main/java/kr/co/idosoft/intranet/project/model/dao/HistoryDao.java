package kr.co.idosoft.intranet.project.model.dao;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * 
 * @author 송원회
 * @since 2020.03.09
 * @content history DAO
 */
public interface HistoryDao {
	void insert(HashMap<String, Object> insert);
	
	List<Map<String, Object>> selectHistory(String member_no);
	
	//이력 상세 화면
	LinkedHashMap<String, Object> getinfo(LinkedHashMap<String,Object> data);

	//특정 연도 프로젝트 가져오기
	List<Map<String,Object>> getProjectList(Map<String, Object> data);
	
	//직무 가져오기
	List<LinkedHashMap<String, Object>> getrolelist();
	
	//프로젝트 업체 가져오기
	LinkedHashMap<String, Object> getcompany(LinkedHashMap<String,Object> data);
	
	//개인 이력 수정하기
	void update(LinkedHashMap<String,Object> data);
	
	//개인 이력 삭제하기
	void remove(LinkedHashMap<String,Object> data);
	
	//직원명단 호출
	List<LinkedHashMap<String,Object>> memberList();
}

