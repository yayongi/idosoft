package kr.co.idosoft.intranet.util;

import java.io.BufferedOutputStream;
import java.io.Console;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellRangeAddress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.MultipartRequest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import kr.co.idosoft.intranet.member.vo.MemberVO;


@Controller
public class fileController {

	private static final Logger logger = LoggerFactory.getLogger(fileController.class);

	@RequestMapping(value = "/fileUpload", method = RequestMethod.POST)
	@ResponseBody
	public void uploadFile(@RequestParam HashMap<String, Object> param, MultipartHttpServletRequest multipartservletrequest, HttpServletRequest request){

		String path = request.getSession().getServletContext().getRealPath("/")+"resources";

		try{
			ObjectMapper mapper = new ObjectMapper();
			List<HashMap<String, String>> tempList = mapper.readValue((String)param.get("paramData"), List.class);

			int index = 0;
			String uploadPath = "";
			String detailPath = ""; // 占쎈솁占쎌뵬 占쎈씜嚥≪뮆諭� 野껋럥以� 
			String preFileName = ""; // 疫꿸퀣伊� 占쎈솁占쎌뵬 筌륅옙 
			String savedName = ""; // 占쏙옙占쎌삢占쎈막 占쎈솁占쎌뵬筌륅옙


			Iterator<String> iter = multipartservletrequest.getFileNames(); 
			MultipartFile mfile = null; 
			String fieldName = "";
			while (iter.hasNext()) { 
				fieldName = (String) iter.next(); //占쎈솁占쎌뵬占쎌뵠�뵳占�, 占쎌맄占쎈퓠占쎄퐣 file1�⑨옙 file2嚥∽옙 癰귣�源됵옙�몵占쎈빍 file1, file2嚥∽옙 占쎄돌占쎌궔占쎈뼄.
				mfile = multipartservletrequest.getFile(fieldName);  //占쏙옙占쎌삢占쎈쭆 占쎈솁占쎌뵬 揶쏆빘猿�
				logger.debug("file : " + mfile.getOriginalFilename());

				HashMap<String, String> tempMap = new HashMap<String, String>();
				tempMap = tempList.get(index);
				detailPath = tempMap.get("path"); // 占쎈솁占쎌뵬 占쎈씜嚥≪뮆諭� 野껋럥以� 
				preFileName = tempMap.get("prefilename"); // 疫꿸퀣伊� 占쎈솁占쎌뵬 筌륅옙 
				savedName = tempMap.get("savedName"); // 占쏙옙占쎌삢占쎈막 占쎈솁占쎌뵬筌륅옙
				logger.debug("path : " + detailPath);
				logger.debug("preFileName : " + preFileName);
				logger.debug("savedName : " + savedName);

				uploadPath = path+detailPath+savedName; // 占쎈솁占쎌뵬 占쎈씜嚥≪뮆諭� 野껋럥以� + 占쎈솁占쎌뵬 占쎌뵠�뵳占�

				logger.debug("占쎈씜嚥≪뮆諭� 占쎈솁占쎌뵬 野껋럥以� : " + uploadPath);

				File file = new File(uploadPath);

				try {
					// 野껋럥以덂첎占� 占쎈씨占쎌몵筌롳옙 野껋럥以덄몴占� 筌띾슢諭븝옙�뼄.
					if(!file.exists()) { 
						file.mkdirs(); 
					} 

					mfile.transferTo(file); // 占쎈솁占쎌뵬占쎌뱽 占쎌맄占쎈퓠 筌욑옙占쎌젟 野껋럥以덃에占� 占쎈씜嚥≪뮆諭�

					//疫꿸퀣�� 占쎈솁占쎌뵬 占쎄텣占쎌젫 嚥≪뮇彛� 
					if(!"".equals(preFileName) && preFileName != null) {
						logger.debug("占쎄텣占쎌젫 野껋럥以� : " + detailPath+preFileName);
						deleteFile(preFileName,path+detailPath);
					}
				}catch(Exception e) {
					e.printStackTrace();
				}
				index++;
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
	//占쎈솁占쎌뵬占쎄텣占쎌젫
	public void deleteFile(String fileName,String filePath) {

		logger.debug(filePath+fileName);

		File file = new File(filePath+fileName); 
		if( file.exists() ){ 
			if(file.delete()){ 
				System.out.println("占쎈솁占쎌뵬占쎄텣占쎌젫 占쎄쉐�⑨옙"); 
			}else{ 
				System.out.println("占쎈솁占쎌뵬占쎄텣占쎌젫 占쎈뼄占쎈솭"); 
			} 
		}else{ 
			System.out.println("占쎈솁占쎌뵬占쎌뵠 鈺곕똻�삺占쎈릭筌욑옙 占쎈륫占쎈뮸占쎈빍占쎈뼄."); 
		} 

	}

	//占쎈솁占쎌뵬 占쎈뼄占쎌뒲嚥≪뮆諭�
	@RequestMapping(value = "/fileDownload", method = RequestMethod.POST)
	@ResponseBody
	public void downloadFile(HttpServletRequest request, HttpServletResponse response) throws IOException {

		String path = request.getSession().getServletContext().getRealPath("/")+"resources";
		try{

			String fileName = request.getParameter("filename"); 
			//占쎌뵥占쎄숲占쎄쉬 占쎌뵡占쎈뮞占쎈탣嚥≪뮆�쑎 �뤃�됲뀋
			if(request.getHeader("user-agent").indexOf("MSIE") == -1) {
				fileName = new String(fileName.getBytes("UTF-8"),"8859_1");
			}else {
				fileName = new String(fileName.getBytes("EUC-KR"),"8859_1");
			}
			String filePath = request.getParameter("path");
			String fileFullPath = path + filePath + fileName;
			logger.debug("野껋럥以� : "+path);

			logger.debug("占쎈솁占쎌뵬 野껋럥以� : " + fileFullPath);

			File file = new File(fileFullPath);
			if(file.exists()) {
				response.setContentType("application/octet-stream");
				response.setHeader("Content-Transfer-Encoding", "binary"); 
				response.setHeader("content-disposition", "attachment;fileName=\""+fileName+"\";");
				response.setHeader("filename", URLEncoder.encode(fileName, "UTF-8"));

				FileInputStream fileinputstream = new FileInputStream(file);
				ServletOutputStream servletoutputstream = response.getOutputStream();
				BufferedOutputStream bufferedoutputstream=new BufferedOutputStream(servletoutputstream);

				byte readByte[] = new byte[1024];
				int data = 0;
				while((data = fileinputstream.read(readByte,0,readByte.length)) != -1) {
					bufferedoutputstream.write(readByte,0,data);
				}

				servletoutputstream.flush();
				servletoutputstream.close();
				fileinputstream.close();
				bufferedoutputstream.flush();
				bufferedoutputstream.close();
				logger.debug("占쎈솁占쎌뵬 占쎈뼄占쎌뒲嚥≪뮆諭뜹첎占� 占쎌끏�뙴占� 占쎈┷占쎈�占쎈뮸占쎈빍占쎈뼄.");
			}else {
				logger.debug("占쎈솁占쎌뵬占쎌뵠 鈺곕똻�삺占쎈릭筌욑옙 占쎈륫占쎈뮸占쎈빍占쎈뼄.");
			}
		}
		catch (Exception e){
			logger.debug("占쎈솁占쎌뵬占쎈뼄占쎌뒲嚥≪뮆諭띰옙肉� 占쎈뼄占쎈솭占쎈릭占쏙옙占쎈뮸占쎈빍占쎈뼄.");
			e.printStackTrace();
		}
	}

	// 占쎈퓡占쏙옙 占쎈솁占쎌뵬 占쎄문占쎄쉐 �빊�뮆�젾
	public void exportExcel(List<LinkedHashMap<String,Object>> memberData, String title, String category, String searchword, HttpServletResponse response){
		try {
			HSSFWorkbook workbook = new HSSFWorkbook();

			Sheet sheet = workbook.createSheet("sheet");	//占쎈퉸占쎈뼣 占쎈솁占쎌뵬占쎌뵠 占쎄문占쎄쉐 占쎈쭍 Sheet筌륅옙
			Row row = null;									//占쎈뻬 ->
			Cell cell = null; 								// 占쎈뻬占쎈툧占쎈퓠 占쎈립燁삳챸釉녕㎉占�
			int rowNo = 1;
			int cellNo = 0;

			//占쎈엘占쎈쐭 占쎄깻占쎌쁽 Bold
			Font font = workbook.createFont();
			font.setBold(true);

			// 占쎈�믭옙�뵠�뇡占� 占쎈엘占쎈쐭占쎌뒠 占쎈뮞占쏙옙占쎌뵬
			CellStyle headStyle = workbook.createCellStyle();

			headStyle.setBorderTop(BorderStyle.THIN);
			headStyle.setBorderBottom(BorderStyle.THIN);
			headStyle.setBorderLeft(BorderStyle.THIN);
			headStyle.setBorderRight(BorderStyle.THIN);
			headStyle.setFont(font);

			// 占쎈엘占쎈쐭 占쎄문占쎄쉐
			LinkedHashMap<String, Object> headerData = memberData.get(0);

			// 占쎌뵠占쎄숲占쎌쟿占쎌뵠占쎄숲 占쎌뵠占쎌뒠占쎈퉸占쎄퐣 key 揶쏅�れ몵嚥∽옙 占쎈엘占쎈쐭 筌띾슢諭얏묾占�
			Set<String> set = headerData.keySet();
			Iterator<String> iterator = set.iterator();

			// 검색 내역 입력
			row = sheet.createRow(0);
			cell = row.createCell(0);
			if(category == null && searchword == null) {
				cell.setCellValue("검색 조건 => 전체");

			}else {
				if("0".equals(category)) {
					cell.setCellValue("검색 조건 => 이름 : " + searchword);
				}else if("1".equals(category)) {
					cell.setCellValue("검색 조건 => 직급 : " + searchword);

				}else {
					cell.setCellValue("검색 조건 => "+searchword);
				}
			}


			//0甕곤옙 row
			row = sheet.createRow(rowNo++);

			// 占쎈쑓占쎌뵠占쎄숲 筌띾벏釉⑨옙�뒠 �뵳�딅뮞占쎈뱜
			List<String> tempList = new ArrayList<String>();

			//Key 揶쏅�れ뱽 占쎈엘占쎈쐭占쎈퓠 占쎄퐫占쎈선 餓ο옙占쎈뼄.
			while(iterator.hasNext()){

				String key = (String)iterator.next();

				logger.debug("#KEY[" + cellNo + "]" +  " : " + key);

				cell = row.createCell(cellNo++);
				cell.setCellStyle(headStyle);
				cell.setCellValue(key);
				tempList.add(key);
			}
			// 占쎈쑓占쎌뵠占쎄숲 �겫占썽겫占� 占쎄문占쎄쉐
			for(int i = 0; i < memberData.size();i++) {
				LinkedHashMap<String, Object> data = new LinkedHashMap<String, Object>();
				data = memberData.get(i);
				row = sheet.createRow(rowNo++);
				for(int j = 0;j < data.size();j++) {
					cell = row.createCell(j);

					Object tempData = data.get(tempList.get(j));

					//null 泥섎━
					if(tempData == null) {
						tempData = "";
					}

					// 揶쏆빘猿� 占쏙옙占쎌뿯占쎈퓠 占쎈뎡�몴占� 筌ｌ꼶�봺
					if(tempData instanceof Boolean) {
						cell.setCellValue((Boolean)tempData);
					}else if(tempData instanceof String){
						cell.setCellValue((String)tempData);
					}else if(tempData instanceof Integer) {
						cell.setCellValue((Integer)tempData);
					}
				}
			}

			//LinkedHashMap<String, Object> data = new LinkedHashMap<String, Object>();
			//data = memberData.get(0);
			// CELL 占쎄쾿疫뀐옙 占쎌쁽占쎈짗 鈺곌퀣�젟
			//for(int k = 0;k < data.size();k++) {
			//sheet.autoSizeColumn(k);
			//}
			// �뚢뫂�쀯㎘占� 占쏙옙占쎌뿯�⑨옙 占쎈솁占쎌뵬筌륅옙 筌욑옙占쎌젟
			response.setContentType("application/download;charset=utf-8");
			response.setHeader("Content-Disposition", "attachment;filename="+new String(title.getBytes("utf-8"),"8859_1"));
			response.setHeader("Content-Transfer-Encoding", "binary");
			//response.setHeader("filename", new String(title.getBytes("utf-8"),"8859_1"));

			// 占쎈퓡占쏙옙 �빊�뮆�젾
			workbook.write(response.getOutputStream());
			workbook.close();
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
	public void exportExceptionExcel(List<LinkedHashMap<String, Object>> list1, List<LinkedHashMap<String, Object>> list2,
			String title, String searchword,HttpServletResponse response) {
		try {
			HSSFWorkbook workbook = new HSSFWorkbook();

			Sheet sheet = workbook.createSheet("sheet");	//�빐�떦 �뙆�씪�씠 �깮�꽦 �맆 Sheet紐�
			Row row = null;									//�뻾 ->
			Cell cell = null; 								// �뻾�븞�뿉 �븳移명븳移�
			int rowNo = 2;
			int cellNo = 0;

			//�뿤�뜑 �겢�옄 Bold
			Font font = workbook.createFont();
			font.setBold(true);

			// �뀒�씠釉� �뿤�뜑�슜 �뒪���씪
			CellStyle headStyle = workbook.createCellStyle();

			headStyle.setBorderTop(BorderStyle.THIN);
			headStyle.setBorderBottom(BorderStyle.THIN);
			headStyle.setBorderLeft(BorderStyle.THIN);
			headStyle.setBorderRight(BorderStyle.THIN);
			headStyle.setFont(font);

			// �뿤�뜑 �깮�꽦
			LinkedHashMap<String, Object> headerData = list1.get(0);

			// �씠�꽣�젅�씠�꽣 �씠�슜�빐�꽌 key 媛믪쑝濡� �뿤�뜑 留뚮뱾湲�
			Set<String> set = headerData.keySet();
			Iterator<String> iterator = set.iterator();

			// 검색 내역 입력
			row = sheet.createRow(0);
			cell = row.createCell(0);
			if(searchword != null) {
				cell.setCellValue("검색 조건 => "+searchword);
			}

			//0踰� row
			row = sheet.createRow(rowNo++);

			// 데이터 맵핑용 리스트
			List<String> tempList = new ArrayList<String>();

			//Key 값을 헤더에 넣어 준다..
			while(iterator.hasNext()){
				String key = (String)iterator.next();

				logger.debug("#KEY[" + cellNo + "]" +  " : " + key);

				cell = row.createCell(cellNo++);
				cell.setCellStyle(headStyle);
				cell.setCellValue(key);
				tempList.add(key);
			}
			// 데이터 부분 생성
			LinkedHashMap<String, Object> data1 = new LinkedHashMap<String, Object>();
			LinkedHashMap<String, Object> data2 = new LinkedHashMap<String, Object>();

			for(int i=0; i<list1.size(); i++) {
				data1 = list1.get(i);
				data2 = list2.get(i);

				row = sheet.createRow(rowNo++);
				for(int j=0; j<data1.size(); j++) {
					cell = row.createCell(j);

					Object tempData = data1.get(tempList.get(j));

					if(j == 3) {
						cell.setCellValue("통신비");
					} else {
						if(j > 3) {
							if(tempData instanceof String){
								cell.setCellValue(Integer.parseInt((String)tempData));
							} else {
								cell.setCellValue((Integer)tempData);
							}
						} else {
							// 객체 타입에 따른 처리
							if(tempData instanceof Boolean) {
								cell.setCellValue((Boolean)tempData);
							} else if(tempData instanceof String){
								cell.setCellValue((String)tempData);
							} else if(tempData instanceof Integer) {
								cell.setCellValue((Integer)tempData);
							} else if(tempData instanceof Double){
								cell.setCellValue((Double)tempData);
							}
						}
					}


				}
				row = sheet.createRow(rowNo++);
				for(int j=0; j<data1.size(); j++) {
					cell = row.createCell(j);

					if(j == 3) {
						cell.setCellValue("교통비");
					} else {
						Object tempData = data2.get(tempList.get(j));

						logger.debug("#tempData [" + j +"] : " + tempData);

						// 객체 타입에 따른 처리
						if(tempData instanceof Boolean) {
							cell.setCellValue((Boolean)tempData);
						} else if(tempData instanceof String){
							cell.setCellValue((String)tempData);
						} else if(tempData instanceof Integer) {
							cell.setCellValue((Integer)tempData);
						} else if(tempData instanceof Double){
							cell.setCellValue((Double)tempData);
						}  else if(tempData instanceof Long){
							cell.setCellValue((Long)tempData);
						}
					}
				}

				//셀 병합
				sheet.addMergedRegion(new CellRangeAddress(rowNo-2,rowNo-1,0,0)); //열시작, 열종료, 행시작, 행종료 (자바배열과 같이 0부터 시작)
				sheet.addMergedRegion(new CellRangeAddress(rowNo-2,rowNo-1,1,1)); //열시작, 열종료, 행시작, 행종료 (자바배열과 같이 0부터 시작)
				sheet.addMergedRegion(new CellRangeAddress(rowNo-2,rowNo-1,2,2)); //열시작, 열종료, 행시작, 행종료 (자바배열과 같이 0부터 시작)
				sheet.addMergedRegion(new CellRangeAddress(rowNo-2,rowNo-1,17,17)); //열시작, 열종료, 행시작, 행종료 (자바배열과 같이 0부터 시작)

			}

			//LinkedHashMap<String, Object> data = new LinkedHashMap<String, Object>();
			//data = memberData.get(0);
			// CELL 크기 자동 조정
			//for(int k = 0;k < data.size();k++) {
			//sheet.autoSizeColumn(k);
			//}
			// 컨텐츠 타입과 파일명 지정
			response.setContentType("application/download;charset=utf-8");
			response.setHeader("Content-Disposition", "attachment;filename="+new String(title.getBytes("utf-8"),"8859_1"));
			response.setHeader("Content-Transfer-Encoding", "binary");
			//response.setHeader("filename", new String(title.getBytes("utf-8"),"8859_1"));

			// �뿊�� 異쒕젰
			workbook.write(response.getOutputStream());
			workbook.close();
		}catch(Exception e) {
			logger.debug("# Exception : " + e.getMessage());
		}
	}
}