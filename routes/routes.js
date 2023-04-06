const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const usermodel = require('../database/MongoDB');
//express 모듈에서 Router라는 함수를 가져와서 router라는 변수에 담는다.


router.get('/', (req, res) => {
    res.render('index/index');
})


module.exports = router;
//이 파일에서 정의한 함수 또는 변수를 다른 파일에서 사용할 수 있도록 내보내는 역할을 한다.




// 메인화면
    // 검색기능
    // 사이트 설명

// 이미지뷰어
    // 이미지를 전체적으로 보는 기능
    // 이미지를 하나만 보기
    // 이미지를 좋아요/싫어요
    // 이미지를 댓글 달기

// 이미지 업로드 (로그인 필요)
    // 이미지 업로드
    // 이미지 수정/삭제
    // 이미지 태그

// 로그인
    // 로그인 기능
    // 회원정보 수정/삭제 기능

// 회원가입
    // 회원가입 기능
    // 회원탈퇴 기능

// 데이터베이스
    // 사이트 관리자 계정