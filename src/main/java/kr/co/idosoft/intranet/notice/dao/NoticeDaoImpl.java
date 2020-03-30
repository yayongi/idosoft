package kr.co.idosoft.intranet.notice.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import kr.co.idosoft.intranet.notice.service.NoticeServiceImpl;
import kr.co.idosoft.intranet.notice.vo.NoticeVO;

@Repository("NoticeDao")
public class NoticeDaoImpl implements NoticeDao{
	
	@Autowired
	private SqlSessionTemplate sqlTemplate;
	
	private static final Logger logger = LoggerFactory.getLogger(NoticeDaoImpl.class);
	
	//공지사항 등록
	@Override
	public void insert(NoticeVO noticeVO) {
		sqlTemplate.insert("notice.insert", noticeVO);
	}
	
	//공지사항 수정
	@Override
	public int update(NoticeVO noticeVO) {
		return sqlTemplate.update("notice.update", noticeVO);
	}
	
	//공지사항 삭제
	@Override
	public int delete(int board_no) {
		return sqlTemplate.delete("notice.deleteInfo", board_no);
	}
	
	//공지사항 가져오기
	@Override
	public NoticeVO select(int board_no) {
		// TODO Auto-generated method stub
		return sqlTemplate.selectOne("notice.selectInfo", board_no);
	}
	
	//공지사항 리스트 가져오기
	@Override
	public List<NoticeVO> selectList(Map<String,Object> data) {
		List<NoticeVO> list = sqlTemplate.selectList("notice.selectList", data);
		return list;
	}
	//공지사항 리스트 카운트
	@Override
	public int count(Map<String,Object> data) {
		int count = sqlTemplate.selectOne("notice.count", data);
		return count;
	}
	
	//대쉬보드용 리스트
	@Override
	public List<NoticeVO> selectListDashboard() {
		return sqlTemplate.selectList("selectListDashboard");
	}
	
	
	
	
	
	
	
	
	
	
}
