package kr.co.idosoft.demo.dao;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import kr.co.idosoft.demo.vo.TodoVO;

/**
 * 일정관리 Repository 구현객체
 * @author 유경이
 *
 */
@Repository
public class TodoDaoImpl implements TodoDao {
	@Autowired
	private SqlSessionTemplate sqlTemplate;
	
	/**
	 * 일정 목록 조회
	 * @return
	 */
	@Override
	public List<TodoVO> selectTodoList() {
		return sqlTemplate.selectList("selectTodoList");
	}
	
	/**
	 * 일정 등록
	 */
	@Override
	public int insertTodo(TodoVO vo) {
		sqlTemplate.insert("insertTodo", vo);
		return vo.getId();
	}
	/**
	 * 일정 삭제
	 */
	@Override
	public int deleteTodo(TodoVO vo) {
		// TODO Auto-generated method stub
		return sqlTemplate.delete("deleteTodo", vo);
	}
	/**
	 * 일정 상태 변경
	 */
	@Override
	public int updateTodoState(TodoVO vo) {
		return sqlTemplate.update("updateTodoState", vo);
	}
}
