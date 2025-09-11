let thisWidget

//全局中间变量
let currJD
let currWD
//当前页面业务
function initWidgetView(_thisWidget) {
  thisWidget = _thisWidget

  initUI()
}

function initUI() {
  $('input:radio[name="rdoType"]').change(function () {
    let selectType = $(this).val()

    switch (selectType) {
      default:
        //十进制
        $(".viewTen").show()
        $(".viewDms").hide()
        $(".viewGk").hide()
        updateTen()
        break
      case "2": //度分秒
        $(".viewDms").show()
        $(".viewTen").hide()
        $(".viewGk").hide()
        thisWidget.setViewCss({
          width: 355
        })
        updataDfm()
        break
      case "3": //CGCS2000
        $(".viewTen").hide()
        $(".viewDms").hide()
        $(".viewGk").show()
        thisWidget.setViewCss({
          height: 220
        })
        updata3GKZone()
        updata6GKZone()
        break
    }
  })

  $('input:radio[name="rdoGkType"]').change(function () {
    let selectType2 = $(this).val()
    switch (selectType2) {
      default:
        $(".viewGk3").show()
        $(".viewGk6").hide()
        updata3GKZone()
        break
      case "2": //当前视角范围
        $(".viewGk3").hide()
        $(".viewGk6").show()
        updata6GKZone()
        break
    }
  })
}

//修改了：十进制
function changeTen() {
  currJD = Number($("#txtLngTen").val() || 0) //获取经度
  currWD = Number($("#txtLatTen").val() || 0) //获取纬度
}

//更新：十进制
function updateTen() {
  if (currJD) {
    $("#txtLngTen").val(thisWidget.getFormatNum(currJD, 6))
    $("#txtLatTen").val(thisWidget.getFormatNum(currWD, 6))
  }
}
//修改了：度分秒
function changeDfm() {
  let jd_du = Number($("#txtLngDegree").val() || 0) //获取
  let jd_fen = Number($("#txtLngMinute").val() || 0)
  let jd_miao = Number($("#txtLngSecond").val() || 0)
  currJD = thisWidget.getDms2degree(jd_du, jd_fen, jd_miao)

  let wd_du = Number($("#txtLatDegree").val() || 0) //获取
  let wd_fen = Number($("#txtLatMinute").val() || 0)
  let wd_miao = Number($("#txtLatSecond").val() || 0)
  currWD = thisWidget.getDms2degree(wd_du, wd_fen, wd_miao)
}

//更新：度分秒
function updataDfm() {
  let tenJD = thisWidget.getDegree2dms(currJD)
  if (currJD) {
    $("#txtLngDegree").val(tenJD.degree)
    $("#txtLngMinute").val(tenJD.minute)
    $("#txtLngSecond").val(tenJD.second)

    let tenWD = thisWidget.getDegree2dms(currWD)
    $("#txtLatDegree").val(tenWD.degree)
    $("#txtLatMinute").val(tenWD.minute)
    $("#txtLatSecond").val(tenWD.second)
  }
}

//修改了：2000平面坐标三分度
function change3GKZone() {
  let jd = Number($("#txtGk3X").val()) //获取
  let wd = Number($("#txtGk3Y").val())

  let gk3 = thisWidget.getProj4Trans([jd, wd], "CGCS2000_GK_Zone_3", "EPSG:4326")
  currJD = gk3[0]
  currWD = gk3[1]
}
//更新：2000平面坐标三分度
function updata3GKZone() {
  let zone3 = thisWidget.getProj4Trans([currJD, currWD], "EPSG:4326", "CGCS2000_GK_Zone_3") //十进制转2000平面三分度
  if (currJD) {
    $("#txtGk3X").val(thisWidget.getFormatNum(zone3[0], 1))
    $("#txtGk3Y").val(thisWidget.getFormatNum(zone3[1], 1))
  }
}

//修改了：2000平面坐标六分度
function change6GKZone() {
  let jd = Number($("#txtGk6X").val()) //获取
  let wd = Number($("#txtGk6Y").val())
  let gk6 = thisWidget.getProj4Trans([jd, wd], "CGCS2000_GK_Zone_6", "EPSG:4326")

  currJD = gk6[0]
  currWD = gk6[1]
}
//更新：2000平面坐标六分度
function updata6GKZone() {
  let zoon6 = thisWidget.getProj4Trans([currJD, currWD], "EPSG:4326", "CGCS2000_GK_Zone_6") //十进制转2000平面六分度
  if (currJD) {
    $("#txtGk6X").val(thisWidget.getFormatNum(zoon6[0], 1))
    $("#txtGk6Y").val(thisWidget.getFormatNum(zoon6[1], 1))
  }
}

//图上拾取
function bindMourseClick() {
  // map.setCursor(true);
  thisWidget.bindMourseClick(mouseClickCallBack)
}

function mouseClickCallBack(jd, wd) {
  currJD = jd
  currWD = wd
}

function submitCenter() {
  if (currJD > 180 || currJD < -180) {
    haoutil.alert("请输入有效的经度值！")
    return
  }
  if (currWD > 90 || currWD < -90) {
    haoutil.alert("请输入有效的纬度值！")
    return
  }

  thisWidget.updateMarker(currWD, currJD) //更新点
  if (thisWidget.pointEntity) {
    thisWidget.flyToGraphic(thisWidget.pointEntity)
  }
}

function updateMarker() {
  thisWidget.updateMarker(currWD, currJD)
}
