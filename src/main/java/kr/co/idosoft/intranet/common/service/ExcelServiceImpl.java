package kr.co.idosoft.intranet.common.service;

import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * 
 * @author 유기환
 * @since 2020.03.16
 * @content ExcelService
 */

@Service
public class ExcelServiceImpl implements ExcelService {
	
	private static final Logger LOG = LoggerFactory.getLogger(ExcelServiceImpl.class);
	/**
	 *  엑셀 워크북 객체로 생성 
	 * @param list
	 * @return SXSSFWorkbook
	 */
	@Override
	public SXSSFWorkbook commonExcelWorkbook(String title, List<Map<String,Object>> list) {
		SXSSFWorkbook workbook = new SXSSFWorkbook();
			
		// 시트 생성
		SXSSFSheet sheet = workbook.createSheet(title);
		
		Map<String, Object> headItem = list.get(0);

		
		for(Map.Entry<String, Object> subItem: headItem.entrySet()){
			// 열너비 설정
			sheet.setColumnWidth(0, 2000);
		}

		Row headerRow = sheet.createRow(0);
		Cell headerCell = headerRow.createCell(0);

		LOG.debug("###################################################################");
		for(Map.Entry<String, Object> subItem: headItem.entrySet()){
			
			// 해당 행의 첫번째 열 셀 생성
			LOG.debug("# subItem : " + subItem.getKey());
			// 키값으로 header
			headerCell.setCellValue(String.valueOf(subItem.getKey()));
		}
		LOG.debug("###################################################################");
		// 내용 행 및 셀 생성
		Row bodyRow = null;
		Cell bodyCell = null;
		
		int i = 0;
		int j = 0;

		for(Map<String, Object> bodyItem : list){
			// 행 생성
			j 		= 0;
			
			bodyRow = sheet.createRow(i+1);
			
			LOG.debug(" ROW : " + bodyRow.getRowNum());
			
			for(Map.Entry<String, Object> subItem: bodyItem.entrySet()){
				bodyCell = bodyRow.createCell(j);
				
				LOG.debug("# subItem Value("+j+") : " + subItem.getValue());
				// 데이터 번호 표시
				bodyCell.setCellValue(String.valueOf(subItem.getValue()));

				j++;
			}
			i++;
		}
		LOG.debug("###################################################################");
		
		return workbook;
	}
	
	/**
	 *  엑셀 파일 다운로드 프로세스 
	 * @param list
	 * @return SXSSFWorkbook
	 */
	@Override
	public void excelFileExportProcess(String title, 
								SXSSFWorkbook workbook,
								HttpServletRequest request, 
								HttpServletResponse response) {
		
		Locale locale 		= Locale.KOREA;
		String workbookName = title;

		// 겹치는 파일 이름 중복을 피하기 위해 시간을 이용해서 파일 이름에 추가
		Date date 					= new Date();
		SimpleDateFormat dayformat 	= new SimpleDateFormat("yyyyMMdd", locale);
		SimpleDateFormat hourformat = new SimpleDateFormat("hhmmss", locale);
		String day 					= dayformat.format(date);
		String hour 				= hourformat.format(date);
		String fileName 			= workbookName + "_" + day + "_" + hour + ".xlsx";         

		// 여기서부터는 각 브라우저에 따른 파일이름 인코딩작업
		String browser 				= request.getHeader("User-Agent");
		
		try {
			if (browser.indexOf("MSIE") > -1) {
				fileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");
			} else if (browser.indexOf("Trident") > -1) {       // IE11
				fileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");
			} else if (browser.indexOf("Firefox") > -1) {
				fileName = "\"" + new String(fileName.getBytes("UTF-8"), "8859_1") + "\"";
			} else if (browser.indexOf("Opera") > -1) {
				fileName = "\"" + new String(fileName.getBytes("UTF-8"), "8859_1") + "\"";
			} else if (browser.indexOf("Chrome") > -1) {
				StringBuffer sb = new StringBuffer();
				for (int i = 0; i < fileName.length(); i++) {
					char c = fileName.charAt(i);
					if (c > '~') {
						sb.append(URLEncoder.encode("" + c, "UTF-8"));
					} else {
						sb.append(c);
					}
				}
				fileName = sb.toString();
			} else if (browser.indexOf("Safari") > -1){
				fileName = "\"" + new String(fileName.getBytes("UTF-8"), "8859_1")+ "\"";
			} else {
				fileName = "\"" + new String(fileName.getBytes("UTF-8"), "8859_1")+ "\"";
			}
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		
		LOG.debug("# fileName : " + fileName);
		
		response.setContentType("application/download;charset=utf-8");
		response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\";");
		response.setHeader("filename", fileName);
		response.setHeader("Content-Transfer-Encoding", "binary");

		OutputStream os = null;

		try {
			os = response.getOutputStream();

			// 파일생성
			workbook.write(os);
		}catch (Exception e) {
			e.printStackTrace();
		} finally {
			if(workbook != null) {
				try {
					workbook.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}

			if(os != null) {
				try {
					os.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
	}
}
