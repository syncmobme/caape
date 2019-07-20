// Initialize your app
var myApp = new Framework7({
    // Default title for modals
    modalTitle: 'CAAPE',
    tapHold: true,
    tapHoldPreventClicks: true,
     // Enable Material theme
    material: true,
    swipePanel: 'left',
    swipePanelNoFollow: 'true',
    swipePanelActiveArea: '80',
    swipeBackPage: false,
    fastClick: true,
    notificationCloseOnClick: true,
    notificationHold: 7000,
    preloadPreviousPage: true,
    imagesLazyLoadThreshold: 100,

}); 
//var mySwiper = new Swiper('.swiper-container');
    var mySwiper = myApp.swiper('.swiper-container', {
        pagination:'.swiper-pagination',
        direction: 'horizontal',
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        setWrapperSize: true
    });


///////////////////////// iniciar dom /////////////////////////
var $$ = Dom7;
var $server = 'https://bynn.es/caape/';
var $serverCau = 'https://www.caape.org.br/api/';

onDeviceReady();

if (localStorage.getItem("email")) {
    $$(".profile_nome").html(localStorage.getItem("name"));
    $$(".profile_detalhes").html(localStorage.getItem("email"));
    if (localStorage.getItem("picture")) {
        $$(".profile_foto img").attr("src",localStorage.getItem("picture"));
    }
    if (localStorage.getItem("cover")) {
        $$(".profile").append("<img src='"+localStorage.getItem('cover')+"' class='imgCover'>");
    }
}

myApp.onPageReinit('home', function (page) {

        localStorage.setItem("idCategoria","");
        $$(".profile").removeClass("bg-teal bg-red bg-green bg-purple bg-red bg-indigo bg-amber bg-orange");
        $$(".profile").addClass("bg-indigo");
        $$("body").removeClass("theme-teal theme-red theme-green theme-purple theme-indigo theme-amber theme-orange");
        $$("body").addClass("theme-indigo");
        //ofertasHome();
    if (localStorage.getItem("email")) {
        $$(".profile_nome").html(localStorage.getItem("name"));
        $$(".profile_detalhes").html(localStorage.getItem("email"));
        if (localStorage.getItem("picture")) {
            $$(".profile_foto img").attr("src",localStorage.getItem("picture"));
        }
        if (localStorage.getItem("cover")) {
            $$(".profile").append("<img src='"+localStorage.getItem('cover')+"' class='imgCover'>");
        }
    }
});



document.addEventListener("backbutton", voltar, false);


function voltar(){
    
    if ($('.modal.modal-in').length > 0 || $('.actions-modal.modal-in').length > 0 || $('.popup.modal-in').length > 0) { 
        myApp.closeModal('.popup.modal-in');
        myApp.closeModal('.modal.modal-in');
        myApp.closeModal('.actions-modal.modal-in');
    } else {
        mainView.router.back();
    }
}

//atualiza submenu

$.ajax({
    url: $server+"Gerar_json.php?idCidade=1&op=countoferta&full=1",
    dataType : "json",
    success: function(data) {
        //console.log(data);
        if (data!=null) {
            $(".tab-beneficios span").attr('data-count',data.oferta[0].Qtd);

            if ($(".tab-beneficios span").attr('data-count',data.oferta[0].Qtd)!="00") {
                $('.tab-beneficios .counting').each(function() {
                  var $this = $(this),
                      countTo = $this.attr('data-count');
                  
                  $({ countNum: $this.text()}).animate({
                    countNum: countTo
                  },

                  {

                    duration: 2000,
                    easing:'linear',
                    step: function() {
                      $this.text(Math.floor(this.countNum));
                    },
                    complete: function() {
                      $this.text(this.countNum);
                      //alert('finished');
                    }

                  });  
                });
            }

        }
    }
});

//verifica se esta logado
console.log("entrei logado");
if (!localStorage.getItem("tokenAnuidade")) {
    
    $(".tab-pontos").html('<span class="counting" data-count="">LOGIN</span>anuidade zero');

}else{

    $(".profile_nome").html(localStorage.getItem("nome"));
    
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://anuidadezero.oabpe.org.br/fidelidade/rest/participante/score",
      "method": "GET",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+localStorage.getItem("tokenAnuidade"),
        "Accept": "*/*",
        "cache-control": "no-cache"
      },
      "processData": false
    }

    $.ajax(settings).done(function (response) {
        //localStorage.setItem("tokenAnuidade",response.token);
        console.log(response);

            $(".tab-pontos span").attr('data-count',parseInt(response));

            if ($(".tab-pontos span").attr('data-count')!="00") {
                $('.tab-pontos .counting').each(function() {
                  var $this = $(this),
                      countTo = $this.attr('data-count');
                  
                  $({ countNum: $this.text()}).animate({
                    countNum: countTo
                  },

                  {

                    duration: 2000,
                    easing:'linear',
                    step: function() {
                      $this.text(Math.floor(this.countNum));
                    },
                    complete: function() {
                      $this.text(this.countNum);
                      //alert('finished');
                    }

                  });  
                });
            }

    }); 
}

myApp.onPageReinit('extrato', function (page) {
    //extrato();
});
function extrato(){
    if (localStorage.getItem("tokenAnuidade")) {
        mainView.router.load({pageName: 'extrato'});
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://anuidadezero.oabpe.org.br/fidelidade/rest/transacao/0/30/?cpf="+localStorage.getItem("cpfAnuidade"),
          "method": "GET",
          "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+localStorage.getItem("tokenAnuidade"),
            "Accept": "*/*",
            "cache-control": "no-cache"
          },
          "processData": false
        }

        $.ajax(settings).done(function (response) {

            var qtd = response.items.length;
            var dataCidades = "";
            var selectCidade = "";
            var contExtrato = "";
            if (response!=null) {
                $(".tab-transacoes").html();

                $(".tab-transacoes span").attr('data-count',qtd);
                $(".profile_nome").html(response.items[0].participante.user.nome);
                localStorage.setItem("nome",response.items[0].participante.user.nome);

                if ($(".tab-transacoes span").attr('data-count',qtd)!="00") {
                    $('.tab-transacoes .counting').each(function() {
                      var $this = $(this),
                          countTo = $this.attr('data-count');
                      
                      $({ countNum: $this.text()}).animate({
                        countNum: countTo
                      },

                      {

                        duration: 2000,
                        easing:'linear',
                        step: function() {
                          $this.text(Math.floor(this.countNum));
                        },
                        complete: function() {
                          $this.text(this.countNum);
                          //alert('finished');
                        }

                      });  
                    });
                }

                if ($(".tab-pontos span").attr('data-count')!="00") {
                    $('.tab-pontos .counting').each(function() {
                      var $this = $(this),
                          countTo = $this.attr('data-count');
                      
                      $({ countNum: $this.text()}).animate({
                        countNum: countTo
                      },

                      {

                        duration: 2000,
                        easing:'linear',
                        step: function() {
                          $this.text(Math.floor(this.countNum));
                        },
                        complete: function() {
                          $this.text(this.countNum);
                          //alert('finished');
                        }

                      });  
                    });
                }

                    contExtrato += '<div class="headerImgLogin no-padding">'+
                                        '<img src="images/logo-anuidadezero.jpg">'+
                                    '</div>'+
                                    '<div class="data-table card">'+
                                      '<table>'+
                                        '<thead>'+
                                          '<tr>'+
                                            '<th>Data</th>'+
                                            '<th>Etabelecimento</th>'+
                                            '<th>Forma de Pgto</th>'+
                                            '<th>Nº Parcelas</th>'+
                                            '<th>Valor</th>'+
                                            '<th>% Desconto</th>'+
                                            '<th>Pontos</th>'+
                                          '</tr>'+
                                        '</thead>'+
                                        '<tbody>';
                for (var i = 0; i < qtd; i++) {
                            contExtrato +='<tr>'+
                                            '<td nowrap>'+response.items[i].dataTransacao+'</td>'+
                                            '<td nowrap>'+response.items[i].nomeEstabelecimento+'</td>'+
                                            '<td nowrap>'+response.items[i].descricaoCompra+'</td>'+
                                            '<td nowrap>('+response.items[i].quantidadeParcelas+'/'+response.items[i].numeroParcela+')</td>'+
                                            '<td nowrap>R$ '+formatReal(response.items[i].valorParcela)+'</td>'+
                                            '<td nowrap>'+response.items[i].estabelecimento.taxaDesconto+'</td>'+
                                            '<td nowrap>'+response.items[i].pontuacao+'</td>'+
                                          '</tr>';
                }
                            contExtrato +='</tbody>'+
                                      '</table>'+
                                    '</div>';

                $('#extrato-cont').html(contExtrato);
            }
        }); 

    }else{
        myApp.modal({
            title:  'Opps!',
            text: 'Para visualizar seu extrato, você precisa fazer o seu login.',
            buttons: [
              {
                text: 'Fechar',
                onClick: function() {
                    //mainView.router.back();
                }
              },
              {
                text: 'Login',
                onClick: function() {
                    mainView.router.load({pageName: "login"});
                }
              },
            ]
        });
    }
}

$$('.button-login').on('click', function(){

    $$cpf = $("#txtcpf").val();
    $$senha = $("#txtsenha").val();

    if ($$senha!="" && $$cpf!="") {

        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://anuidadezero.oabpe.org.br/fidelidade/rest/auth",
          "method": "POST",
          "headers": {
            "Content-Type": "application/json",
            "Accept": "*/*",
            "cache-control": "no-cache"
          },
          "processData": false,
          "data": "{\n    \"username\": \""+$$cpf+"\",\n    \"password\": \""+$$senha+"\"\n}"
        }
        localStorage.setItem("cpfAnuidade",$$cpf);
        $.ajax(settings).done(function (response) {

            localStorage.setItem("tokenAnuidade",response.token);
            console.log(response);

            var settings = {
              "async": true,
              "crossDomain": true,
              "url": "https://anuidadezero.oabpe.org.br/fidelidade/rest/participante/score",
              "method": "GET",
              "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+response.token,
                "Accept": "*/*",
                "cache-control": "no-cache"
              },
              "processData": false
            }

            $.ajax(settings).done(function (response) {
                localStorage.setItem("pontosAnuidade",response);
                $(".tab-pontos").html('<span class="counting" data-count="'+parseInt(response)+'">'+parseInt(response)+'</span>pontos');

                if ($(".tab-pontos span").attr('data-count')!="00") {
                    $('.tab-pontos .counting').each(function() {
                      var $this = $(this),
                          countTo = $this.attr('data-count');
                      
                      $({ countNum: $this.text()}).animate({
                        countNum: countTo
                      },

                      {

                        duration: 2000,
                        easing:'linear',
                        step: function() {
                          $this.text(Math.floor(this.countNum));
                        },
                        complete: function() {
                          $this.text(this.countNum);
                          //alert('finished');
                        }

                      });  
                    });
                }

                console.log(response);
                myApp.alert('Login realizado com sucesso!', function () { extrato();});
            }); 

        }).fail(function(response) {
            console.log(response);
                 myApp.alert("Opps! "+response.responseJSON.message);
        });
    }else{
        myApp.alert("Opps! Favor preencher todos os campos.");
    }
});

// menu 2 niveis
$$('.menuservico').on('click', function (e) {
    console.log("subservico");
    $(".menuservico .sublist").toggleClass("hide");
    $(".menubeneficio .sublist").addClass("hide");
    $(".menudialogo .sublist").addClass("hide");
});
$$('.menubeneficio').on('click', function (e) {
    console.log("menubeneficio");
    $(".menubeneficio .sublist").toggleClass("hide");
    $(".menuservico .sublist").addClass("hide");
    $(".menudialogo .sublist").addClass("hide");

});
$$('.menudialogo').on('click', function (e) {
    console.log("menudialogo");
    $(".menudialogo .sublist").toggleClass("hide");
    $(".menubeneficio .sublist").addClass("hide");
    $(".menuservico .sublist").addClass("hide");

});
document.addEventListener("offline", onOffline, false);

function onOffline() {
    /*myApp.addNotification({
        title: "Conexão falhou!",
        //subtitle: e.payload.subtitle,
        message: 'Você precisa de conexão com a internet para acessar o Aptohome',
        media: '<img src='+e.payload.media+'>',
    });*/
    myApp.alert('Você precisa de conexão com a internet');
}
function onOnline() {
    //myApp.popup(".popup-off");
}

document.addEventListener("online", onOnline, false);


///////////////////////// tab enter ///////////////////////////////
function tabenter(event,campo){
    var tecla = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    //alert("entrei"+tecla+" - "+campo);
    if (tecla==13) {
        //alert("entrei"+tecla+" - "+campo);
        event.preventDefault();
        campo.focus();
        return false;
    }
}

///////////////////////// auto focus ///////////////////////////////
  if (myApp.device.android) {
    $(".sair").show();
    var getPos = function (obj) {
      var left, top;
      left = top = 0;
      if (obj.offsetParent) {
          do {
              left += obj.offsetLeft;
              top  += obj.offsetTop;
          } while (obj = obj.offsetParent);
      }
      return {
          x : left,
          y : top
      };
    };

        window.addEventListener('native.keyboardshow', function (e){
        window.keyboardHeight = e.keyboardHeight;
        var y = getPos(document.activeElement).y;
        $$($$(document.activeElement).parents('.page-content')).scrollTop(y-e.keyboardHeight/2);
    });
  }

///////////////////////// abrir panel left /////////////////////////
$$('.open-left-panel').on('click', function (e) {
    // 'left' position to open Left panel
    myApp.openPanel('left');
});

///////////////////////// abrir panel right /////////////////////////
$$('.open-right-panel').on('click', function (e) {
    // 'right' position to open Right panel
    myApp.openPanel('right');
});

// fechar panel
$$('.panel-close').on('click', function (e) {
    myApp.closePanel();
});

//abrir panel
$$('.open-panel').on('click', function (e) {
    // 'left' position to open Left panel
    myApp.openPanel('left');
});


///////////////////////// Add view /////////////////////////
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,
    domCache: true //enable inline pages
});

///////////////////////// abrir ligacao /////////////////////////
function openURL(alvo){
    //alert(alvo);
    window.open(alvo);
    //window.open(alvo, '_system', 'location=yes');
}

///////////////////////// abrir browser /////////////////////////
function openURLBrowser(alvo){
    //alert(alvo);
    //window.open(alvo);
    window.open(alvo, '_system', 'location=yes');
}


///////////////////// retirar caracteres em branco ////////////////////////////////
    function trimespaco(alvo) {

        while(alvo.indexOf(" ") != -1){
            alvo = alvo.replace(" ", "");
        }

        return alvo;
    }
////////////////////////// rotacao do aparelho /////////////////////////

function onportrait(){
    window.screen.lockOrientation('portrait');
    return;
}

function onlandscape(){
    window.screen.lockOrientation('landscape');
    return;
}


function nl2br (str, is_xhtml) {   
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

////////// enviar fale conosco //////////
$$('.button-form-participe').on('click', function(){
    $$nomepolitico = $$('#txtparticipenomepolitico').val();
    $$emaildestino = $$('#txtparticipeemaildestino').val();
    $$assunto = $$('#txtparticipeassunto').val();
    $$nome = $$('#txtparticipenome').val();
    $$email = $$('#txtparticipeemail').val();
    $$telefone = $$('#txtparticipetelefone').val();
    $$mensagem = nl2br($$('#txtparticipemensagem').val());

    if ($$assunto!="" && $$nome!="" && $$email!="" && $$mensagem!="") {

        var data = new Date();
        var str_data = data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate();

        $.ajax({
            url: $server+"sendcontact.php?txtparticipenomepolitico="+$$nomepolitico+"&txtparticipeemaildestino="+$$emaildestino+"&txtparticipeassunto="+$$assunto+"&txtparticipenome="+$$nome+"&txtparticipeemail="+$$email+"&txtparticipemensagem="+$$mensagem+"&txtparticipetelefone="+$$telefone,
            type: "post",
            success: function(data) {
                $('#forminserirparticipe').each (function(){
                  this.reset();
                });
                console.log("data = "+data);
                myApp.alert(data);
            }
        });
    }else{
        myApp.alert("Opss! Favor preencher todos os campos.");
    }
});

/////////////////////////// atualizar token ///////////////////////////

function atualizartoken(){
    console.log("atualizartoken");
    $.ajax({
        url: $server+"Gerar_json.php?op=token&action=inserir&token="+localStorage.getItem("token"),
        dataType : "json",
        success: function(data) {
            if (data) {
                console.log("Token gravado: "+data);
            }
        }
    });
}

///////////////////////////// sair ////////////////////////////

function sair() {
    myApp.confirm('Deseja realmente sair?', function () {

        localStorage.clear();
        $$(".profile_nome").html("Seja bem-vindo!");
        $$(".profile_detalhes").html("Selecione uma das opções abaixo");

        window.location = "index.html";
        navigator.app.exitApp();
    });
}


//////////////////////////// profile /////////////////////////////

function profile(){
//console.log("profile");
    // profile
    var profile_image = "<img src="+localStorage.getItem("profileImage")+">";
    $('.profile_foto').html(profile_image);
    $('.profile_nome').html(localStorage.getItem("moradorNome"));

    if(localStorage.getItem("blocoNum")){
        var bloco_num = "Bloco: " + localStorage.getItem("blocoNum") + " | ";
    }
    var profile_detalhes = "Condomínio: " + localStorage.getItem("condominioNome") + " <br>"+ bloco_num + "Apto: " + localStorage.getItem("domicilioNum");

    $('.profile_detalhes').html(profile_detalhes);
        
        //popupBanner();
        //mainView.router.loadPage("bannercont");
        //myApp.alert('Morador editado om sucesso!', 'Aptohome', function () { mainView.router.load({pageName: 'bannercont'});popupBanner();});
}
myApp.onPageReinit('home', function (page) {

});
// Pull to refresh content
var ptrContent = $$('.ofertasHome');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {

        ofertasHome();
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
});


//////////////////////////////////// cidades /////////////////////
function cidades(){ 
    myApp.showIndicator();

        $.ajax({
            url: $server+"Gerar_json.php?op=cidades",
            dataType : "json",
            success: function(data) {
                //console.log(data);
                var qtd = data.cidades.length;
                var dataCidades = "";
                var selectCidade = "";
                if (data!=null) {
                    for (var i = 0; i < qtd; i++) {
                        if (localStorage.getItem("idCidade")==data.cidades[i].id) {
                            selectCidade = " bg-gray color-white";
                        }
                        dataCidades += '<li class="item-content'+selectCidade+'">'+
                                            '<a href="#" class="item-link link-cidades">'+
                                                '<div class="item-inner">'+
                                                    '<div class="item-title" onClick="alteraCidade('+data.cidades[i].id+')">'+data.cidades[i].descricao+'/'+data.cidades[i].uf+'</div>'+
                                                '</div>'+
                                            '</a>'+
                                        '</li>';
                        selectCidade = "";
                    }
                    $('#cidades-cont').html(dataCidades);
                    myApp.hideIndicator();
                }else{
                    myApp.hideIndicator();
                    $('#cidades-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                }
            }
        });
}
//////////////////////////////////// ofertasHome /////////////////////

function ofertasHome(){ 

    myApp.showIndicator();
    $('#ofertasHome-cont').html("");
    $(".profile").removeClass("bg-teal bg-red bg-green bg-purple bg-indigo bg-amber bg-orange");
    $(".profile").addClass("bg-indigo");
    $("body").removeClass("theme-teal theme-red theme-green theme-purple theme-indigo theme-amber theme-orange");
    $("body").addClass("theme-indigo");
    if (!localStorage.getItem("idCidade")) {
        localStorage.setItem("idCidade","1");
    }

        $.ajax({
            url: $server+"Gerar_json.php?idCidade=1&op=oferta",
            dataType : "json",
            success: function(data) {
                //console.log(data);
                if (data!=null) {
                    var qtd = data.oferta.length;
                    var imgOferta = "";
                    var dataOferta = "";
                    var opcoes = false;
                    var bgTheme;
                    var bgThemeLight;
                    var colorTheme;
                    var bgThemeTrans;
                    var idCategoria;

                    for (var i = 0; i < qtd; i++) {
                        if (data.oferta[i].Opcoes) {
                            opcoes = true;
                        }
                        idCategoria = data.oferta[i].IdCategoria;

                        if (idCategoria=="11") {
                            bgTheme = "bg-red";
                            colorTheme = "color-red";
                            bgThemeLight = "bg-deeporange";
                            bgThemeTrans = "bg-red-light"
                        }
                        if (idCategoria=="20") {
                            bgTheme = "bg-green";
                            bgThemeLight = "bg-lightgreen";
                            colorTheme = "color-green";
                            bgThemeTrans = "bg-green-light"
                        }
                        if (idCategoria=="2") {
                            bgTheme = "bg-purple";
                            bgThemeLight = "bg-pink";
                            colorTheme = "color-purple";
                            bgThemeTrans = "bg-purple-light"
                        }
                        if (idCategoria=="3") {
                            bgTheme = "bg-indigo";
                            bgThemeLight = "bg-blue";
                            colorTheme = "color-indigo";
                            bgThemeTrans = "bg-indigo-light"
                        }
                        if (idCategoria=="10") {
                            bgTheme = "bg-amber";
                            bgThemeLight = "bg-yellow";
                            colorTheme = "color-amber";
                            bgThemeTrans = "bg-amber-light"
                        }  
                        if (idCategoria=="9") {
                            bgTheme = "bg-orange";
                            bgThemeLight = "bg-amber";
                            colorTheme = "color-orange";
                            bgThemeTrans = "bg-orange-light"
                        } 

                        data.oferta[i].Img[0] = data.oferta[i].Img[0].replace("http://","https://");
                        data.oferta[i].ImgEmpresa[0] = data.oferta[i].ImgEmpresa[0].replace("http://","https://");
                        imgOferta = '<div class="card-content"><img data-src="'+data.oferta[i].Img[0]+'" class="lazy lazy-fadein" width="100%"></div>';

                        dataOferta += '<li data-index="'+i+'" class="'+bgThemeTrans+'">'+
                                            '<a href="#ofertascont" onclick="ofertascont('+data.oferta[i].Id+','+idCategoria+','+opcoes+',\'home\');" class="item-link">'+
                                                '<div class="card-cont ks-facebook-card">'+
                                                    imgOferta+
                                                    '<div class="card-content-inner">'+
                                                        '<div class="card-content-price">'+
                                                            '<img src="'+data.oferta[i].ImgEmpresa[0]+'">'+
                                                        '</div>'+
                                                        '<div class="card-content-info">'+
                                                            '<div class="facebook-date '+colorTheme+'">'+data.oferta[i].EmpresaNome+'</div>'+
                                                            '<div class="facebook-title">'+data.oferta[i].Titulo+'</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</a>'+
                                        '</li>';
                        imgOferta = "";
                    }

                    $('#ofertashome-cont').html(dataOferta);
                    myApp.initImagesLazyLoad(".page");

                myApp.hideIndicator();
                }else{
                    myApp.hideIndicator();
                    $('#ofertashome-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                }
            }
             ,error:function(data){
                myApp.hideIndicator();
                $('#ofertashome-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                //myApp.alert('Erro! Tente novamente.', 'Aptohome');
             }
        });
}


// Pull to refresh content
var ptrContent = $$('.ofertas');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {

        ofertas();
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
});

/////////////////////////////////////  ofertas ///////////////////////
function ofertas(idCategoria){

    if (idCategoria) {
        localStorage.setItem("idCategoria", idCategoria);
    } else {
        var idCategoria;
        idCategoria = localStorage.getItem("idCategoria");
    }

    var bgTheme;
    var bgThemeLight;
    var colorTheme;
    var bgThemeTrans;

    if (idCategoria=="11") {
        $(".profile").removeClass("bg-brown bg-red bg-green bg-teal bg-purple bg-red bg-indigo bg-amber bg-orange");
        $(".profile").addClass("bg-red");
        $("body").removeClass();
        $("body").addClass("theme-red");
        bgTheme = "bg-red";
        colorTheme = "color-red";
        bgThemeLight = "bg-deeporange";
        bgThemeTrans = "bg-red-light";
        $$('.nameofertas').html("GASTRONOMIA");
    }
    if (idCategoria=="20") {
        $(".profile").removeClass("bg-brown bg-red bg-green bg-teal bg-purple bg-red bg-indigo bg-amber bg-orange");
        $(".profile").addClass("bg-green");
        $("body").removeClass();
        $("body").addClass("theme-green");
        bgTheme = "bg-green";
        bgThemeLight = "bg-lightgreen";
        colorTheme = "color-green";
        bgThemeTrans = "bg-green-light";
        $$('.nameofertas').html("VIAGENS");
    }
    if (idCategoria=="2") {
        $(".profile").removeClass("bg-brown bg-red bg-green bg-teal bg-purple bg-red bg-indigo bg-amber bg-orange");
        $(".profile").addClass("bg-purple");
        $("body").removeClass();
        $("body").addClass("theme-purple");
        bgTheme = "bg-purple";
        bgThemeLight = "bg-pink";
        colorTheme = "color-purple";
        bgThemeTrans = "bg-purple-light";
        $$('.nameofertas').html("ESTÉTICA");
    }
    if (idCategoria=="3") {
        $(".profile").removeClass("bg-brown bg-red bg-green bg-teal bg-purple bg-red bg-indigo bg-amber bg-orange");
        $(".profile").addClass("bg-indigo");
        $("body").removeClass();
        $("body").addClass("theme-indigo");
        bgTheme = "bg-indigo";
        bgThemeLight = "bg-blue";
        colorTheme = "color-indigo";
        bgThemeTrans = "bg-indigo-light";
        $$('.nameofertas').html("EVENTOS");
    }
    if (idCategoria=="10") {
        $(".profile").removeClass("bg-brown bg-red bg-green bg-teal bg-purple bg-red bg-indigo bg-amber bg-orange");
        $(".profile").addClass("bg-amber");
        $("body").removeClass();
        $("body").addClass("theme-amber");
        bgTheme = "bg-amber";
        bgThemeLight = "bg-yellow";
        colorTheme = "color-amber";
        bgThemeTrans = "bg-amber-light";
        $$('.nameofertas').html("PRODUTOS");
    }  
    if (idCategoria=="9") {
        $(".profile").removeClass("bg-brown bg-red bg-green bg-teal bg-purple bg-red bg-indigo bg-amber bg-orange");
        $(".profile").addClass("bg-orange");
        $("body").removeClass();
        $("body").addClass("theme-orange");
        bgTheme = "bg-orange";
        bgThemeLight = "bg-amber";
        colorTheme = "color-orange";
        bgThemeTrans = "bg-orange-light";
        $$('.nameofertas').html("SERVIÇOS");
    }  

    myApp.showIndicator();
    $('#ofertashome-cont').html("");

        $.ajax({
            url: $server+"Gerar_json.php?idCategoria="+localStorage.getItem("idCategoria")+"&idCidade=1&op=oferta",
            dataType : "json",
            success: function(data) {
                //console.log(data);
                if (data!=null) {
                    var qtd = data.oferta.length;
                    var imgOferta = "";
                    var dataOferta = "";
                    var opcoes = false;
                    for (var i = 0; i < qtd; i++) {
                        if (data.oferta[i].Opcoes) {
                            opcoes = true;
                        }
                        data.oferta[i].Img[0] = data.oferta[i].Img[0].replace("http://","https://");
                        data.oferta[i].ImgEmpresa[0] = data.oferta[i].ImgEmpresa[0].replace("http://","https://");
                        //imgOferta = '<div class="card-content"><img data-src="'+data.oferta[i].Img[0]+'" class="lazy lazy-fadein" width="100%"><div class="validade">Válido até: '+formatDate(data.oferta[i].dataValidade)+'</div><div class="desconto '+bgThemeLight+' color-white">'+Math.round(data.oferta[i].Desconto)+'%</div></div>';
                        imgOferta = '<div class="card-content"><img data-src="'+data.oferta[i].Img[0]+'" class="lazy lazy-fadein" width="100%"></div>';
                        /*dataOferta += '<li data-index="'+i+'" class="'+bgThemeTrans+'">'+
                                            '<a href="#ofertascont" onclick="ofertascont('+data.oferta[i].Id+','+idCategoria+','+opcoes+',\'filter\');" class="item-link">'+
                                                '<div class="card-cont ks-facebook-card">'+
                                                    imgOferta+
                                                    '<div class="card-content-inner">'+
                                                        '<div class="card-content-price">'+
                                                            '<div class="facebook-price-valor color-white '+bgTheme+'">R$ '+formatReal(getMoney(data.oferta[i].Valor))+'</div>'+
                                                            '<div class="facebook-price-valor-promo color-white '+bgThemeLight+'">R$ '+formatReal(getMoney(data.oferta[i].ValorPromo))+'</div>'+
                                                        '</div>'+
                                                        '<div class="card-content-info">'+
                                                            '<div class="facebook-date '+colorTheme+'">'+data.oferta[i].EmpresaNome+'</div>'+
                                                            '<div class="facebook-title">'+data.oferta[i].Titulo+'</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</a>'+
                                        '</li>';*/
                        dataOferta += '<li data-index="'+i+'" class="'+bgThemeTrans+'">'+
                                            '<a href="#ofertascont" onclick="ofertascont('+data.oferta[i].Id+','+idCategoria+','+opcoes+',\'home\');" class="item-link">'+
                                                '<div class="card-cont ks-facebook-card">'+
                                                    imgOferta+
                                                    '<div class="card-content-inner">'+
                                                        '<div class="card-content-price">'+
                                                            '<img src="'+data.oferta[i].ImgEmpresa[0]+'">'+
                                                        '</div>'+
                                                        '<div class="card-content-info">'+
                                                            '<div class="facebook-date '+colorTheme+'">'+data.oferta[i].EmpresaNome+'</div>'+
                                                            '<div class="facebook-title">'+data.oferta[i].Titulo+'</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</a>'+
                                        '</li>';

                        imgOferta = "";
                    }

                    $('#ofertashome-cont').html(dataOferta);
                    myApp.initImagesLazyLoad(".page");
                myApp.hideIndicator();
                }else{
                    myApp.hideIndicator();
                    $('#ofertashome-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                }
            }
             ,error:function(data){
                myApp.hideIndicator();
                $('#ofertashome-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                //myApp.alert('Erro! Tente novamente.', 'Aptohome');
             }
        });
}

// Pull to refresh content
var ptrContent = $$('.meuscupons');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {

        meusCupons();
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
});
/////////////////////////////////////  meus cupons ///////////////////////


$$('.scroll-submenu-meuscupons').on('scroll', function (e) {
    if($$('.scroll-submenu-meuscupons').scrollTop()>0){
        $$('.sub-menu-meuscupons').attr("id","sub-menu-meuscupons-fixed");
        $$('.scroll-submenu-meuscupons').css('padding-top', '100px');
    } else {
        $$('.sub-menu-meuscupons').removeAttr("id","sub-menu-meuscupons-fixed");
        $$('.scroll-submenu-meuscupons').removeAttr('style');
    }
});

$$('.tab-meuscupons-baixados').on('show', function () {
    var coords = $$('.scroll-submenu-meuscupons').offset();
    var top = coords.top;
    var newHeight = "";
    newHeight = $$('.baixados-meuscupons').height() + 270;
    //$$('.scroll-tab').css('height', newHeight+'px');

    $$('.scroll-submenu-meuscupons').scrollTop(0);

});
 
$$('.tab-meuscupons-usados').on('show', function () {
    var coords = $$('.scroll-submenu-meuscupons').offset();
    var top = coords.top;
    var newHeight = "";
    newHeight = $$('.usados-meuscupons').height() + 270;
    //$$('.scroll-tab').css('height', newHeight+'px');

    $$('.scroll-submenu-meuscupons').scrollTop(0);

});
 
$$('.tab-meuscupons-expirados').on('show', function () {
    var coords = $$('.scroll-submenu-meuscupons').offset();
    var top = coords.top;
    var newHeight = "";
    newHeight = $$('.expirados-meuscupons').height() + 270;
    //$$('.scroll-tab').css('height', newHeight+'px');

    $$('.scroll-submenu-meuscupons').scrollTop(0);

});

$$('.ofertasList').on('taphold', function () {
  myApp.alert($(this).attr("data-oferta"));
});

function meusCupons(){

    //if (localStorage.getItem("userID")) {
        mainView.router.load({pageName: "meuscupons"});
        //myApp.showTab('#tabmeuscupons1');
        myApp.showIndicator();
        $('#ofertas-cont').html("");

            //baixados
            $.ajax({
                url: $server+"Gerar_json.php?op=compra&ativo=1&userToken="+localStorage.getItem("userToken")+"&action=getCliente",
                dataType : "json",
                success: function(data) {
                    //console.log(data);

                    $$('.scroll-submenu-meuscupons').scrollTop(0);
                    $$('.sub-menu-meuscupons').removeAttr("id","sub-menu-meuscupons-fixed");
                    $$('.scroll-submenu-meuscupons').removeAttr('style');

                    if (data!=null) {
                        var qtd = data.oferta.length;
                        var imgOfertaBaixados = "";
                        var imgOfertaUsados = "";
                        var imgOfertaExpirados = "";
                        var dataOfertaBaixados = "";
                        var dataOfertaUsados = "";
                        var dataOfertaExpirados = "";
                        var opcoes = false;
                        for (var i = 0; i < qtd; i++) {
                            if (data.oferta[i].Opcoes) {
                                opcoes = true;
                            }

                            var bgTheme;
                            var bgThemeLight;
                            var colorTheme;
                            var bgThemeTrans;
                            var idCategoria = data.oferta[i].IdCategoria;

                            if (idCategoria=="11") {
                                bgTheme = "bg-red";
                                colorTheme = "color-red";
                                bgThemeLight = "bg-deeporange";
                                bgThemeTrans = "bg-red-light";
                            }
                            if (idCategoria=="20") {
                                bgTheme = "bg-green";
                                bgThemeLight = "bg-lightgreen";
                                colorTheme = "color-green";
                                bgThemeTrans = "bg-green-light";
                            }
                            if (idCategoria=="2") {
                                bgTheme = "bg-purple";
                                bgThemeLight = "bg-pink";
                                colorTheme = "color-purple";
                                bgThemeTrans = "bg-purple-light";
                            }
                            if (idCategoria=="3") {
                                bgTheme = "bg-indigo";
                                bgThemeLight = "bg-blue";
                                colorTheme = "color-indigo";
                                bgThemeTrans = "bg-indigo-light";
                            }
                            if (idCategoria=="10") {
                                bgTheme = "bg-amber";
                                bgThemeLight = "bg-yellow";
                                colorTheme = "color-amber";
                                bgThemeTrans = "bg-amber-light";
                            }  
                            if (idCategoria=="9") {
                                bgTheme = "bg-orange";
                                bgThemeLight = "bg-amber";
                                colorTheme = "color-orange";
                                bgThemeTrans = "bg-orange-light";
                            } 

                            imgOfertaBaixados = '<div class="card-content"><img data-src="'+data.oferta[i].Img[0]+'" class="lazy lazy-fadein" width="100%"></div>';

                            dataOfertaBaixados += '<li data-index="'+i+'" class="swipeout ofertasList swipeout-devcupom '+bgThemeTrans+'" data-oferta="'+data.oferta[i].Id+'">'+
                                                '<a href="#ofertascont" onclick="ofertascont('+data.oferta[i].Id+','+idCategoria+','+opcoes+',\'home\');" class="swipeout-content item-link">'+
                                                    '<div class="card-cont ks-facebook-card">'+
                                                        imgOfertaBaixados+
                                                        '<div class="card-content-inner">'+
                                                            '<div class="card-content-price">'+
                                                                '<img src="'+data.oferta[i].ImgEmpresa[0]+'">'+
                                                            '</div>'+
                                                            '<div class="card-content-info">'+
                                                                '<div class="facebook-date '+colorTheme+'">'+data.oferta[i].EmpresaNome+'</div>'+
                                                                '<div class="facebook-title">'+data.oferta[i].Titulo+'</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</a>'+
                                                '<div class="swipeout-actions-right">'+
                                                    '<a href="#" onclick="devCupom('+data.oferta[i].IdCupom+','+i+');" data-order="'+i+'" class="bg-red">APAGAR</a>'+
                                                '</div>'+
                                            '</li>';

                            imgOferta = "";

                        }

                        $$('.scroll-submenu-meuscupons').scrollTop(0);
                        $$('.sub-menu-meuscupons').removeAttr("id","sub-menu-meuscupons-fixed");
                        $$('.scroll-submenu-meuscupons').removeAttr('style');

                        $('#meuscupons-baixados-cont').html(dataOfertaBaixados);
                        //$$('.nameofertasCupons').html("MEUS CUPONS");
                        myApp.initImagesLazyLoad(".page");
                    myApp.hideIndicator();
                    }else{
                        myApp.hideIndicator();
                        $('#meuscupons-baixados-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                    }
                }
                 ,error:function(data){
                    myApp.hideIndicator();
                    $('#meuscupons-baixados-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                    //myApp.alert('Erro! Tente novamente.', 'Aptohome');
                 }
            });

            //usados
            $.ajax({
                url: $server+"Gerar_json.php?op=compra&ativo=2&idCliente="+localStorage.getItem("userID")+"&action=getCliente",
                dataType : "json",
                success: function(data) {
                    //console.log(data);

                    $$('.scroll-submenu-meuscupons').scrollTop(0);
                    $$('.sub-menu-meuscupons').removeAttr("id","sub-menu-meuscupons-fixed");
                    $$('.scroll-submenu-meuscupons').removeAttr('style');

                    if (data!=null) {
                        var qtd = data.oferta.length;
                        var imgOfertaBaixados = "";
                        var imgOfertaUsados = "";
                        var imgOfertaExpirados = "";
                        var dataOfertaBaixados = "";
                        var dataOfertaUsados = "";
                        var dataOfertaExpirados = "";
                        var opcoes = false;
                        for (var i = 0; i < qtd; i++) {
                            if (data.oferta[i].Opcoes) {
                                opcoes = true;
                            }

                            var bgTheme;
                            var bgThemeLight;
                            var colorTheme;
                            var bgThemeTrans;
                            var idCategoria = data.oferta[i].IdCategoria;

                            if (idCategoria=="11") {
                                bgTheme = "bg-red";
                                colorTheme = "color-red";
                                bgThemeLight = "bg-deeporange";
                                bgThemeTrans = "bg-red-light";
                            }
                            if (idCategoria=="20") {
                                bgTheme = "bg-green";
                                bgThemeLight = "bg-lightgreen";
                                colorTheme = "color-green";
                                bgThemeTrans = "bg-green-light";
                            }
                            if (idCategoria=="2") {
                                bgTheme = "bg-purple";
                                bgThemeLight = "bg-pink";
                                colorTheme = "color-purple";
                                bgThemeTrans = "bg-purple-light";
                            }
                            if (idCategoria=="3") {
                                bgTheme = "bg-indigo";
                                bgThemeLight = "bg-blue";
                                colorTheme = "color-indigo";
                                bgThemeTrans = "bg-indigo-light";
                            }
                            if (idCategoria=="10") {
                                bgTheme = "bg-amber";
                                bgThemeLight = "bg-yellow";
                                colorTheme = "color-amber";
                                bgThemeTrans = "bg-amber-light";
                            }  
                            if (idCategoria=="9") {
                                bgTheme = "bg-orange";
                                bgThemeLight = "bg-amber";
                                colorTheme = "color-orange";
                                bgThemeTrans = "bg-orange-light";
                            } 


                            imgOfertaUsados = '<div class="card-content"><img src="'+data.oferta[i].Img[0]+'" width="100%"><div class="validade">Válido até: '+formatDate(data.oferta[i].dataValidade)+'</div><div class="desconto '+bgThemeLight+' color-white">'+Math.round(data.oferta[i].Desconto)+'%</div></div>';

                            dataOfertaUsados += '<li data-index="'+i+'" class="ofertasList '+bgThemeTrans+'" data-oferta="'+data.oferta[i].Id+'">'+
                                                '<a href="#" class="swipeout-content item-link">'+
                                                    '<div class="card-cont ks-facebook-card">'+
                                                        imgOfertaUsados+
                                                        '<div class="card-content-inner">'+
                                                            '<div class="card-content-price">'+
                                                                '<div class="facebook-price-valor color-white '+bgTheme+'">R$ '+formatReal(getMoney(data.oferta[i].Valor))+'</div>'+
                                                                '<div class="facebook-price-valor-promo color-white '+bgThemeLight+'">R$ '+formatReal(getMoney(data.oferta[i].ValorPromo))+'</div>'+
                                                            '</div>'+
                                                            '<div class="card-content-info">'+
                                                                '<div class="facebook-date '+colorTheme+'">'+data.oferta[i].EmpresaNome+'</div>'+
                                                                '<div class="facebook-title">'+data.oferta[i].Titulo+'</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</a>'+
                                            '</li>';
                            imgOfertaUsados = "";
                        
                        }

                        $$('.scroll-submenu-meuscupons').scrollTop(0);
                        $$('.sub-menu-meuscupons').removeAttr("id","sub-menu-meuscupons-fixed");
                        $$('.scroll-submenu-meuscupons').removeAttr('style');

                        $('#meuscupons-usados-cont').html(dataOfertaUsados);
                        //$$('.nameofertasCupons').html("MEUS CUPONS");
                        myApp.initImagesLazyLoad(".page");
                    myApp.hideIndicator();
                    }else{
                        myApp.hideIndicator();
                        $('#meuscupons-usados-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                    }
                }
                 ,error:function(data){
                    myApp.hideIndicator();
                    $('#meuscupons-usados-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                    //myApp.alert('Erro! Tente novamente.', 'Aptohome');
                 }
            });

            //expirados
            $.ajax({
                url: $server+"Gerar_json.php?op=compra&ativo=3&idCliente="+localStorage.getItem("userID")+"&action=getCliente",
                dataType : "json",
                success: function(data) {
                    //console.log(data);

                    $$('.scroll-submenu-meuscupons').scrollTop(0);
                    $$('.sub-menu-meuscupons').removeAttr("id","sub-menu-meuscupons-fixed");
                    $$('.scroll-submenu-meuscupons').removeAttr('style');

                    if (data!=null) {
                        var qtd = data.oferta.length;
                        var imgOfertaBaixados = "";
                        var imgOfertaUsados = "";
                        var imgOfertaExpirados = "";
                        var dataOfertaBaixados = "";
                        var dataOfertaUsados = "";
                        var dataOfertaExpirados = "";
                        var opcoes = false;
                        for (var i = 0; i < qtd; i++) {
                            if (data.oferta[i].Opcoes) {
                                opcoes = true;
                            }

                            var bgTheme;
                            var bgThemeLight;
                            var colorTheme;
                            var bgThemeTrans;
                            var idCategoria = data.oferta[i].IdCategoria;

                            if (idCategoria=="11") {
                                bgTheme = "bg-red";
                                colorTheme = "color-red";
                                bgThemeLight = "bg-deeporange";
                                bgThemeTrans = "bg-red-light";
                            }
                            if (idCategoria=="20") {
                                bgTheme = "bg-green";
                                bgThemeLight = "bg-lightgreen";
                                colorTheme = "color-green";
                                bgThemeTrans = "bg-green-light";
                            }
                            if (idCategoria=="2") {
                                bgTheme = "bg-purple";
                                bgThemeLight = "bg-pink";
                                colorTheme = "color-purple";
                                bgThemeTrans = "bg-purple-light";
                            }
                            if (idCategoria=="3") {
                                bgTheme = "bg-indigo";
                                bgThemeLight = "bg-blue";
                                colorTheme = "color-indigo";
                                bgThemeTrans = "bg-indigo-light";
                            }
                            if (idCategoria=="10") {
                                bgTheme = "bg-amber";
                                bgThemeLight = "bg-yellow";
                                colorTheme = "color-amber";
                                bgThemeTrans = "bg-amber-light";
                            }  
                            if (idCategoria=="9") {
                                bgTheme = "bg-orange";
                                bgThemeLight = "bg-amber";
                                colorTheme = "color-orange";
                                bgThemeTrans = "bg-orange-light";
                            } 

                            imgOfertaExpirados = '<div class="card-content"><img src="'+data.oferta[i].Img[0]+'" width="100%"><div class="validade">Válido até: '+formatDate(data.oferta[i].dataValidade)+'</div><div class="desconto '+bgThemeLight+' color-white">'+Math.round(data.oferta[i].Desconto)+'%</div></div>';

                            dataOfertaExpirados += '<li data-index="'+i+'" class="ofertasList '+bgThemeTrans+'" data-oferta="'+data.oferta[i].Id+'">'+
                                                '<a href="#" class="swipeout-content item-link">'+
                                                    '<div class="card-cont ks-facebook-card">'+
                                                        imgOfertaExpirados+
                                                        '<div class="card-content-inner">'+
                                                            '<div class="card-content-price">'+
                                                                '<div class="facebook-price-valor color-white '+bgTheme+'">R$ '+formatReal(getMoney(data.oferta[i].Valor))+'</div>'+
                                                                '<div class="facebook-price-valor-promo color-white '+bgThemeLight+'">R$ '+formatReal(getMoney(data.oferta[i].ValorPromo))+'</div>'+
                                                            '</div>'+
                                                            '<div class="card-content-info">'+
                                                                '<div class="facebook-date '+colorTheme+'">'+data.oferta[i].EmpresaNome+'</div>'+
                                                                '<div class="facebook-title">'+data.oferta[i].Titulo+'</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</a>'+
                                            '</li>';
                            imgOfertaExpirados = "";
                        
                        }

                        $$('.scroll-submenu-meuscupons').scrollTop(0);
                        $$('.sub-menu-meuscupons').removeAttr("id","sub-menu-meuscupons-fixed");
                        $$('.scroll-submenu-meuscupons').removeAttr('style');

                        $('#meuscupons-expirados-cont').html(dataOfertaExpirados);
                        //$$('.nameofertasCupons').html("MEUS CUPONS");
                        myApp.initImagesLazyLoad(".page");
                    myApp.hideIndicator();
                    }else{
                        myApp.hideIndicator();
                        $('#meuscupons-expirados-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                    }
                }
                 ,error:function(data){
                    myApp.hideIndicator();
                    $('#meuscupons-expirados-cont').html("<li class='semregistro'>Nenhum registro cadastrado</li>");
                    //myApp.alert('Erro! Tente novamente.', 'Aptohome');
                 }
            });

    /*}else{
        myApp.modal({
            title:  'Opss',
            text: 'Para acessar os seus cupons, você precisa estar logado no Sifrão',
            buttons: [
              {
                text: 'Fechar',
              },
              {
                text: 'Logar',
                onClick: function() {
                  mainView.router.load({pageName: "login"});
                }
              },
            ]
        });
    }*/
}



function nl2br (str, is_xhtml) {   
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

$$('.scroll-submenu-oferta').on('scroll', function (e) {
    if($$('.scroll-submenu-oferta').scrollTop()>269){
        $$('.sub-menu-oferta').attr("id","sub-menu-oferta-fixed");
        $$('.scroll-submenu-oferta').css('padding-top', '100px');
    } else {
        $$('.sub-menu-oferta').removeAttr("id","sub-menu-oferta-fixed");
        $$('.scroll-submenu-oferta').removeAttr('style');
    }
});

$$('.tab-oferta-opcoes').on('show', function () {
    var coords = $$('.scroll-submenu-oferta').offset();
    var top = coords.top;
    var newHeight = "";
    newHeight = $$('.opcoes-oferta').height() + 270;
    //$$('.scroll-tab').css('height', newHeight+'px');

    if (top>269) {
        $$('.scroll-submenu-oferta').scrollTop(270);
    } else {
        $$('.scroll-submenu-oferta').scrollTop(top);
    }
    /*$('body').height()-265
    $$('.scroll-submenu-oferta').scrollTop($$('.scroll-submenu-oferta').scrollTop());
    $$('.tab-oferta-opcoes').css("height","");
    $$('.tab-oferta-descricao').css("height","0");
    $$('.tab-oferta-regras').css("height","0");
    $$('.tab-oferta-local').css("height","0");*/
});
 
$$('.tab-oferta-descricao').on('show', function () {
    var coords = $$('.scroll-submenu-oferta').offset();
    var top = coords.top;
    var newHeight = "";
    newHeight = $$('.descricao-oferta').height() + 270;
    //$$('.scroll-tab').css('height', newHeight+'px');

    if (top>269) {
        $$('.scroll-submenu-oferta').scrollTop(270);
    } else {
        $$('.scroll-submenu-oferta').scrollTop(top);
    }
    /*$$('.scroll-submenu-oferta').scrollTop($$('.scroll-submenu-oferta').scrollTop());
    $$('.tab-oferta-opcoes').css("height","0");
    $$('.tab-oferta-descricao').css("height","");
    $$('.tab-oferta-regras').css("height","0");
    $$('.tab-oferta-local').css("height","0");*/
});
 
$$('.tab-oferta-regras').on('show', function () {
    var coords = $$('.scroll-submenu-oferta').offset();
    var top = coords.top;
    var newHeight = "";
    newHeight = $$('.regras-oferta').height() + 270;
    //$$('.scroll-tab').css('height', newHeight+'px');

    if (top>269) {
        $$('.scroll-submenu-oferta').scrollTop(270);
    } else {
        $$('.scroll-submenu-oferta').scrollTop(top);
    }
    /*$$('.scroll-submenu-oferta').scrollTop($$('.scroll-submenu-oferta').scrollTop());
    $$('.tab-oferta-opcoes').css("height","0");
    $$('.tab-oferta-descricao').css("height","0");
    $$('.tab-oferta-regras').css("height","");
    $$('.tab-oferta-local').css("height","0");*/
});

$$('.tab-oferta-local').on('show', function () {
    var coords = $$('.scroll-submenu-oferta').offset();
    var top = coords.top;
    var newHeight = "";
    newHeight = $$('.local-oferta').height() + 270;
    //$$('.scroll-tab').css('height', newHeight+'px');

    if (top>269) {
        $$('.scroll-submenu-oferta').scrollTop(270);
    } else {
        $$('.scroll-submenu-oferta').scrollTop(top);
    }
    /*$$('.scroll-submenu-oferta').scrollTop($$('.scroll-submenu-oferta').scrollTop());
    $$('.tab-oferta-opcoes').css("height","0");
    $$('.tab-oferta-descricao').css("height","0");
    $$('.tab-oferta-regras').css("height","0");
    $$('.tab-oferta-local').css("height","");*/
});


$$('#tab1').on('show', function () {

});

/////////////////////////////////////  oferta conteudo /////////////////////////
function ofertascont(idOferta, idCategoria, opcoes, alvo){

if (!opcoes) {
    

    $$('.tabs').removeAttr("style");
    $$('.tab-link-highlight').css("width","33.3333%");
    $$('.tab-link-highlight').css("transform","translate3d(0%, 0px, 0px)");


    $$('.oferta-opcoes').remove();
    $$('.oferta-descricao').addClass("active");
    $$('.oferta-descricao').attr("href","#tab1");
    $$('.oferta-regras').attr("href","#tab2");
    $$('.oferta-regras').removeClass("active");
    $$('.oferta-local').attr("href","#tab3");
    $$('.oferta-local').removeClass("active");

    $$('.tab-oferta-descricao').attr("id","tab1");
    $$('.tab-oferta-regras').attr("id","tab2");
    $$('.tab-oferta-regras').addClass("swiper-slide-next");
    $$('.tab-oferta-local').attr("id","tab3");

    $$('.tab-oferta-opcoes').remove();

}

    var bgTheme;
    var bgThemeLight;
    var colorTheme;
    var bgThemeTrans;

    if (idCategoria=="11") {
        $(".profile").removeClass("bg-brown bg-red bg-green bg-teal bg-purple bg-red bg-indigo bg-amber bg-orange");
        $(".profile").addClass("bg-red");
        $("body").removeClass();
        $("body").addClass("theme-red");
        bgTheme = "bg-red";
        colorTheme = "color-red";
        bgThemeLight = "bg-deeporange";
        bgThemeTrans = "bg-red-light";
    }
    if (idCategoria=="20") {
        $(".profile").removeClass("bg-brown bg-red bg-green bg-teal bg-purple bg-red bg-indigo bg-amber bg-orange");
        $(".profile").addClass("bg-green");
        $("body").removeClass();
        $("body").addClass("theme-green");
        bgTheme = "bg-green";
        bgThemeLight = "bg-lightgreen";
        colorTheme = "color-green";
        bgThemeTrans = "bg-green-light";
    }
    if (idCategoria=="2") {
        $(".profile").removeClass("bg-brown bg-red bg-green bg-teal bg-purple bg-red bg-indigo bg-amber bg-orange");
        $(".profile").addClass("bg-purple");
        $("body").removeClass();
        $("body").addClass("theme-purple");
        bgTheme = "bg-purple";
        bgThemeLight = "bg-pink";
        colorTheme = "color-purple";
        bgThemeTrans = "bg-purple-light";
    }
    if (idCategoria=="3") {
        $(".profile").removeClass("bg-brown bg-red bg-green bg-teal bg-purple bg-red bg-indigo bg-amber bg-orange");
        $(".profile").addClass("bg-indigo");
        $("body").removeClass();
        $("body").addClass("theme-indigo");
        bgTheme = "bg-indigo";
        bgThemeLight = "bg-blue";
        colorTheme = "color-indigo";
        bgThemeTrans = "bg-indigo-light"
    }
    if (idCategoria=="10") {
        $(".profile").removeClass("bg-brown bg-red bg-green bg-teal bg-purple bg-red bg-indigo bg-amber bg-orange");
        $(".profile").addClass("bg-amber");
        $("body").removeClass();
        $("body").addClass("theme-amber");
        bgTheme = "bg-amber";
        bgThemeLight = "bg-yellow";
        colorTheme = "color-amber";
        bgThemeTrans = "bg-amber-light";
    }  
    if (idCategoria=="9") {
        $(".profile").removeClass("bg-brown bg-red bg-green bg-teal bg-purple bg-red bg-indigo bg-amber bg-orange");
        $(".profile").addClass("bg-orange");
        $("body").removeClass();
        $("body").addClass("theme-orange");
        bgTheme = "bg-orange";
        bgThemeLight = "bg-amber";
        colorTheme = "color-orange";
        bgThemeTrans = "bg-orange-light";
    }  
    myApp.showIndicator();
    $('#ofertascont-cont').html("");
    $('.descricao-oferta').html("");
    $('.regras-oferta').html("");
    $('.local-oferta').html("");
    var datamural = "";

    // fechar speed dial
    $(".speed-dial").removeClass("speed-dial-opened");
    
        $.ajax({
            url: $server+"Gerar_json.php?idOferta="+idOferta+"&op=oferta",
            dataType : "json",
            success: function(data) {

                    $$('.scroll-submenu-oferta').scrollTop(0);
                    $$('.sub-menu-oferta').removeAttr("id","sub-menu-oferta-fixed");
                    $$('.scroll-submenu-oferta').removeAttr('style');
                    var qtd = data.oferta.length;
                    var imgOferta = "";
                    var dataOferta = "";
                    var dataLocal = "";
                    for (var i = 0; i < qtd; i++) {
                        data.oferta[i].ImgEmpresa[0] = data.oferta[i].ImgEmpresa[0].replace("http://","https://");
                        //imgOferta = '<div class="card-content"><img data-src="'+data.oferta[i].Img[0]+'" class="lazy lazy-fadein" width="100%"><div class="validade">Válido até: '+formatDate(data.oferta[i].dataValidade)+'</div><div class="desconto '+bgThemeLight+' color-white">'+Math.round(data.oferta[i].Desconto)+'%</div></div>';
                        imgOferta = '<div class="card-content">'+
                                    '<div class="swiper-container swiper-ofertascont">'+
                                        '<div class="swiper-pagination"></div>'+
                                        '<div class="swiper-wrapper">';
                                        for (var e = 0; e < data.oferta[i].Img.length; e++) {
                                            data.oferta[i].Img[e] = data.oferta[i].Img[e].replace("http://","https://");
                                            imgOferta += '<div class="swiper-slide"><img data-src="'+data.oferta[i].Img[e]+'" class="swiper-lazy" width="100%"><span class="preloader"><span class="preloader-inner"><span class="preloader-inner-gap"></span><span class="preloader-inner-left"><span class="preloader-inner-half-circle"></span></span><span class="preloader-inner-right"><span class="preloader-inner-half-circle"></span></span></span></span></div>';
                                        }
                        imgOferta +=    '</div>'+
                                    '</div>'+
                                '</div>';

                        dataOferta += 
                                                '<div class="card-cont ks-facebook-card">'+
                                                    imgOferta+
                                                    '<div class="card-content-inner '+bgThemeTrans+'">'+
                                                        '<div class="card-content-price">'+
                                                            '<img src="'+data.oferta[i].ImgEmpresa[0]+'">'+
                                                        '</div>'+
                                                        '<div class="card-content-info">'+
                                                            '<div class="facebook-date '+colorTheme+'">'+data.oferta[i].EmpresaNome+'</div>'+
                                                            '<div class="facebook-title">'+data.oferta[i].Titulo+'</div>'+
                                                        '</div>'+
                                                        '<div class="clear"></div>'+
                                                    '</div>'+
                                                '</div>';
                        dataLocal += '<div class="local-container">'+
                                        '<div class="local-end">'+
                                            '<div class="local-bairro '+colorTheme+'">'+data.oferta[i].EmpresaBairro+'</div>'+
                                            '<div class="local-rua">'+data.oferta[i].EmpresaEndereco+', '+data.oferta[i].EmpresaNumero+', '+data.oferta[i].EmpresaCidade+', '+data.oferta[i].EmpresaEstado+'</div>'+
                                        '</div>'+

                                        '<div class="clear"></div>'+
                                    '</div>'+
                                    '<div class="local-map">'+
                                        '<a href="#">'+
                                            '<img src="https://maps.googleapis.com/maps/api/staticmap?size=480x300&zoom=18&markers=icon:https://www.bynn.es/caape/admin/img/maker-caape.png|'+data.oferta[i].EmpresaEndereco+','+data.oferta[i].EmpresaNumero+','+data.oferta[i].EmpresaBairro+','+data.oferta[i].EmpresaCidade+','+data.oferta[i].EmpresaEstado+'&key=AIzaSyAB8ZuJzAX2m3xRhNhXFu9b654LvOgPOHg">'+
                                        '</a>'+
                                    '</div>';

                        imgOferta = "";
                        $('#ofertascont-cont').html(dataOferta);
                        $('.descricao-oferta').html(nl2br(data.oferta[i].Descricao));
                        $('.regras-oferta').html(nl2br(data.oferta[i].Regras));
                        $('.local-oferta').html(dataLocal);

                        $('.speed-dial-buttons .fone').attr('onclick','window.open(\"tel:'+data.oferta[i].EmpresaTel+'\","_system")');
                        $('.speed-dial-buttons .ir').attr('onclick','window.open(\"https://www.google.com/maps/search/?api=1&query='+data.oferta[i].EmpresaEndereco+','+data.oferta[i].EmpresaNumero+','+data.oferta[i].EmpresaBairro+','+data.oferta[i].EmpresaCidade+','+data.oferta[i].EmpresaEstado+'\","_system")');
                        $('.speed-dial-buttons .share').attr('onclick','window.open(\"mailto:'+data.oferta[i].Empresa_email+'\","_system")');
                        $('.local-map a').attr('onclick','window.open(\"https://www.google.com/maps/search/?api=1&query='+data.oferta[i].EmpresaEndereco+','+data.oferta[i].EmpresaNumero+','+data.oferta[i].EmpresaBairro+','+data.oferta[i].EmpresaCidade+','+data.oferta[i].EmpresaEstado+'\","_system")');

                        //$$('.nameofertascont').html(data.oferta[i].EmpresaNome);
                        myApp.initImagesLazyLoad(".page");
                        
                        var baixarCupom = '<a href="#" id="baixarCupom" onClick="baixarCupom('+data.oferta[i].Id+')" class="button-action button button-big button-fill button-raised color-green"><i class="fa fa-download"></i> SALVAR CUPOM</a>';
                        var usarCupom = "";
                        //$('.button-cupom').html(baixarCupom);

                        /*if (localStorage.getItem("userID")) {

                            $.ajax({
                                url: $server+"Gerar_json.php?op=compra&idOferta="+idOferta+"&idCliente="+localStorage.getItem("userID")+"&action=getOfertaCliente",
                                dataType : "json",
                                success: function(data) {
                                    if (data) {
                                        usarCupom = '<a href="#" id="usarCupom" onClick="usarCupom('+data[0].id+','+localStorage.getItem("userID")+');" class="button-action button button-big button-fill button-raised color-green"><i class="fa fa-ticket"></i> USAR CUPOM</a>';
                                        $('.button-cupom').html(usarCupom);
                                    }
                                }
                            });
                        }*/
                    };
                    $$('.scroll-submenu-oferta').scrollTop(0);
                    $$('.sub-menu-oferta').removeAttr("id","sub-menu-oferta-fixed");
                    $$('.scroll-submenu-oferta').removeAttr('style');
/*'<div class="facebook-title">'+$("<div />").html(descricao).text();+'</div>'+
var descricao = data.oferta[i].Descricao;*/

                    if (!opcoes) {
                        myApp.showTab('#tab1');

                        $$('.tabs').removeAttr("style");
                        $$('.tab-link-highlight').css("width","33.3333%");
                        $$('.tab-link-highlight').css("transform","translate3d(0%, 0px, 0px)");

                        $$('.oferta-opcoes').remove();
                        $$('.oferta-descricao').addClass("active");
                        $$('.oferta-descricao').attr("href","#tab1");
                        $$('.oferta-regras').attr("href","#tab2");
                        $$('.oferta-regras').removeClass("active");
                        $$('.oferta-local').attr("href","#tab3");
                        $$('.oferta-local').removeClass("active");

                        $$('.tab-oferta-descricao').attr("id","tab1");
                        $$('.tab-oferta-regras').attr("id","tab2");
                        $$('.tab-oferta-regras').addClass("swiper-slide-next");
                        $$('.tab-oferta-local').attr("id","tab3");

                        $$('.tab-oferta-opcoes').remove();

                        $$('.tab-oferta-descricao').removeClass("swiper-slide-next swiper-slide-prev swiper-slide-active active");
                        $$('.tab-oferta-descricao').addClass("swiper-slide-active active");
                        $$('.tab-oferta-regras').removeClass("swiper-slide-next swiper-slide-prev swiper-slide-active active");
                        $$('.tab-oferta-local').removeClass("swiper-slide-active");
                        $$('.tab-oferta-regras').removeClass("swiper-slide-next swiper-slide-prev swiper-slide-active active");
                        $$('.tab-oferta-local').removeClass("swiper-slide-next swiper-slide-prev swiper-slide-active active");
                    }

                myApp.hideIndicator();

                var mySwiperOfertascont = myApp.swiper('.swiper-ofertascont', {
                    pagination:'.swiper-ofertascont .swiper-pagination',
                    direction: 'horizontal',
                    autoplay: 4000,
                    /*autoplayStopOnLast: true,
                    watchSlidesProgress: true,
                    watchSlidesVisibility: true,
                    setWrapperSize: true,*/
                    preloadImages: false,
                    lazyLoading: true
                });

            }
             ,error:function(data){
                myApp.hideIndicator();
             }
        });

}
function ativarSwiper(){
    console.log("ativarSwiper");
mySwiperOfertascont.update(true);
}
myApp.onPageInit('ofertascont', function (page) {
    console.log("ofertascont");

});
/////////////////////////////////////  baixar cupom /////////////////////////
function baixarCupom(id){

    //if (localStorage.getItem("userID")) {
            $.ajax({
                url: $server+"Gerar_json.php?op=compra&idOferta="+id+"&idCidade=1&userToken="+localStorage.getItem("userToken")+"&name="+localStorage.getItem("name")+"&action=add",
                dataType : "json",
                success: function(data) {
                    if (data) {
                        myApp.alert('Cupom salvo com sucesso! Para visualizar seus cupons salvos, acesse o menu BENEFÍCIOS | SALVOS.');
                        var usarCupom = '<a href="#" id="usarCupom" onClick="usarCupom('+data+','+localStorage.getItem("userID")+');" class="button-action button button-big button-fill button-raised color-green"><i class="fa fa-ticket"></i> USAR CUPOM</a>';
                        $('.button-cupom').html("");
                    }
                }
            });

    /*}else{
        myApp.modal({
            title:  'Opss',
            text: 'Para baixar um cupom, você precisa estar logado no Sifrão',
            buttons: [
              {
                text: 'Fechar',
              },
              {
                text: 'Logar',
                onClick: function() {
                  mainView.router.load({pageName: "login"});
                }
              },
            ]
        });
    }*/
}
/////////////////////////////////////  usar cupom /////////////////////////
function  usarCupom(id,userID){
    console.log("entrei usarCupom");
   cordova.plugins.barcodeScanner.scan(
      function (result) {
          console.log("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
        if (!result.cancelled) {
            
            $.ajax({
                url: $server+"Gerar_json.php?op=compra&idCupom="+id+"&vendedor="+result.text+"&idCliente="+localStorage.getItem("userID")+"&action=usarCupom",
                dataType : "json",
                success: function(data) {
                    if (data==1) {
                        myApp.alert("Cupom ultilizado com sucesso!");
                        window.location = "index.html";
                    }else if (data==2){
                        myApp.alert("Erro! Favor tentar novamente");
                    }
                }
            });            
        }
      }, 
      function (error) {
          console.log("Scanning failed: " + error);
      }
   );
}

/////////////////////////////////////  devolver cupom /////////////////////////

function devCupom(id,eq){
        myApp.confirm('Deseja realmente apagar o cupom?', function () {
            $.ajax({
                url: $server+"Gerar_json.php?op=compra&idCupom="+id+"&userToken="+localStorage.getItem("userToken")+"&action=devCupom",
                dataType : "json",
                success: function(data) {
                    myApp.swipeoutDelete($$('li.ofertasList').eq($("li.ofertasList[data-index="+eq+"]").index()));
                    //console.log(myApp.swipeoutDelete($$('li.ofertasList').eq($("li.ofertasList[data-index="+eq+"]").index())));
                }
            });
        });
}

/* agenda */

/**
 * add a leading zero to a number
 *
 * @param {int} num - a number (or number string)
 * @returns {string}
 */
function addZero(num) {
    if (num < 10) {
        num = "0" + num;
    }
    return String(num);
}

/**
 * format a date string
 *
 * @param {date object} 
 * @returns {string} formated date string for google's api: yyyy-mm-ddTHH:MM:ss-hh:MM
 */
function formatDateTime(now) {
    var mm = addZero(now.getMonth() + 1);
    var dd = addZero(now.getDate());
    var yyyy = now.getFullYear();
    var HH = addZero(now.getHours()); // military time
    var hh = HH > 12 ? addZero(HH - 12) : HH; // 12 hour time
    var MM = addZero(now.getMinutes());
    var SS = addZero(now.getSeconds());
    return [yyyy, mm, dd].join('-') + 'T' + [HH, MM, SS].join(':') + '-' + [hh, MM].join(':');
}



var localSelected = "";
var localDescSelected = "";
function agenda() {
        //console.log("entrei");
        var mesSelected = $('#calendar-inline-container .picker-calendar-day-selected').attr("data-month");
        mesSelected = mesSelected+++1;
        var diaSelected = $('#calendar-inline-container .picker-calendar-day-selected').attr("data-day");
        
        if (diaSelected<10) {
            diaSelected = "0"+diaSelected;
        }
        var anoSelected = $('#calendar-inline-container .picker-calendar-day-selected').attr("data-year");
        var dataSelected = anoSelected+"-"+mesSelected+"-"+diaSelected;
        
        var dataSelectedBr = diaSelected+"/"+mesSelected+"/"+anoSelected;

        $("#dataagendamento").val(dataSelectedBr);

        agendadia(dataSelected);
    
}


function agendadia(dia){
console.log("dia = "+dia);
    myApp.showIndicator();


    $('#espaco-cont').html("");
    $$('#calendar-inline-container div span').removeClass("marcado");

        var API_KEY = 'AIzaSyAB8ZuJzAX2m3xRhNhXFu9b654LvOgPOHg';
        var CALENDAR_ID = 'imprensacaape@gmail.com';

        /** current date object */
        var now = new Date();

        /**
         * Build a Google Calendar API http request 
         * {@link https://developers.google.com/google-apps/calendar/v3/reference/events}
         */
        var request = 'https://www.googleapis.com/calendar/v3/calendars/' +
                CALENDAR_ID +
                '/events?singleEvents=true&orderBy=startTime&fields=items(description%2Csummary%2Cattachments%2Clocation%2Cstart%2ChtmlLink)&timeMin=' +
                formatDateTime(now) +
                '&orderBy=startTime' +
                '&key=' +
                API_KEY;

        $.ajax({
            url: request,
            dataType : "json",
            success: function(data) {
                myApp.hideIndicator();
                var dataespaco = "";
                var qtd = data.items.length;
                for (var i = 0; i < qtd; i++) {

                    var splithoraini="";
                    var dataini = "";
                    if (data.items[i].start.dateTime) {
                        splithoraini = data.items[i].start.dateTime;
                        splithoraini = splithoraini.split("T");
                        dataini = splithoraini[0];
                    }else{
                        splithoraini = data.items[i].start.date;
                        dataini = splithoraini;
                    }

                    console.log(dataini);

                    dataini = dataini.split("-");
                    dataini[1] = dataini[1]-1;
                    if (dataini[2]<10) {
                        dataini[2] = dataini[2].substring(1); 
                    }

                    dataini = dataini[0]+"-"+dataini[1]+"-"+dataini[2];


                    $$('#calendar-inline-container div[data-date="'+dataini+'"] span').addClass("marcado");
                    
                }
            
            },error: function(data) {
                myApp.hideIndicator();
                //myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });


        $.ajax({
            url: request,
            dataType : "json",
            success: function(data) {

            myApp.hideIndicator();
                var dataespaco = "";
                var qtd = data.items.length;
                console.log("qtd = "+qtd);
                for (var i = 0; i < qtd; i++) {

                    if (!data.items[i]) {
                        //console.log("status error = "+data.posts[i].status);
                        $('#espaco-cont').html('<li><div class="item-content">Nenhum evento para data selecionada</div></li>');
                    } else{
                        var splithoraini="";
                        var dataini = "";
                        var dataBr = "";
                        if (data.items[i].start.dateTime) {
                            splithoraini = data.items[i].start.dateTime;
                            splithoraini = splithoraini.split("T");
                            dataini = splithoraini[0];
                            dataBr = data.items[i].start.dateTime;
                        }else{
                            splithoraini = data.items[i].start.date;
                            dataini = splithoraini;
                            dataBr = data.items[i].start.date;
                        }
                        console.log("splithoraini "+i+" = "+splithoraini);


                        //console.log(horaini+" - "+dataini);

                        dataini = dataini.split("-");
                        //dataini[1] = dataini[1];
                        if (dataini[1]<10) {
                            dataini[1] = dataini[1].substring(1); 
                        }

                        dataini = dataini[0]+"-"+dataini[1]+"-"+dataini[2];

                        var imageAgenda = "";
                        var imageAgendaArq = "";
                        var descricao = "";
                        //data.items[i].hasOwnProperty("aviso")
                        if (data.items[i].attachments) {
                            //console.log("fileId = "+data.items[i].attachments[0].fileId);
                            //imageAgenda = '<img src="http://drive.google.com/uc?export=view&id='+data.items[i].attachments[0].fileId+'">';
                            imageAgenda = '<img src="https://drive.google.com/thumbnail?id='+data.items[i].attachments[0].fileId+'">';
                            imageAgendaArq = data.items[i].attachments[0].fileId;
                        }else{
                            imageAgenda = '<img src="images/sem_foto_icone.jpg">';
                            imageAgendaArq = "sem_foto_icone.jpg";
                        }
                        if (data.items[i].description) {
                            descricao = data.items[i].description;
                        }
                        if (dataini==dia) {
                            //console.log("dataini = "+dataini+" dia = "+dia);
                            dataespaco += '<li data-index="'+i+'">'+
                                                '<a href="#agendacont" onclick="agendacont(\''+imageAgendaArq+'\',\''+data.items[i].summary+'\',\''+descricao+'\',\''+dataBr+'\')" class="item-content item-link">'+
                                                    //'<div class="item-media">'+
                                                      //imageAgenda+
                                                    //'</div>'+
                                                    '<div class="item-inner">'+
                                                        '<div class="item-title-row">'+
                                                            '<div class="item-title title-agenda">'+data.items[i].summary+'</div>'+
                                                        '</div>'+
                                                        '<div class="item-title">'+
                                                            '<div class="item-title agenda-date">'+moment(dataBr).locale('pt-br').format('llll')+'</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</a>'+
                                            '</li>';
                        }
                    }
                }
                //console.log("espaco-cont = "+dataespaco);
            $('#espaco-cont').html(dataespaco);
            
            },error: function(data) {
                myApp.hideIndicator();
                //myApp.alert('Erro! Tente novamente.', 'Aptohome');
            }
        });
        //console.log(dia+","+idlocalespaco);
}


 /* exibe agenda */ 
function agendacont(imageAgendaArq,titulo,descricao,date) {
    console.log("agendacont")
    $(".agendacont-cont").empty();

        if (imageAgendaArq=="sem_foto_icone.jpg"){
            imageAgenda = '';
        }else{
            imageAgenda = 'http://drive.google.com/uc?export=view&id='+imageAgendaArq;
        }

        var agendacontcont = "";
        var imgZoom = "";
        var agendacontimg = "";

        if (imageAgenda!="") {
            myPhotoBrowserAgendacont = myApp.photoBrowser({
                theme: 'dark',
                ofText: 'de',
                backLinkText: '',
                spaceBetween: 0,
                navbar: true,
                toolbar: false,
                photos : [imageAgenda],
                type: 'popup'
            });

            imgZoom = "onclick=myPhotoBrowserAgendacont.open();";
            /*agendacontimg = '<div id="thumbPostCont">'+
                                '<i '+imgZoom+' class="fa fa-search-plus fa-3x"></i>'+
                                '<img src="' + imageAgenda + '" '+imgZoom+'>'+
                            '</div>';*/
        }

        agendacontcont += agendacontimg+
        '<div class="containerPostCont"><div id="titPostCont">' + titulo + '</div>'+
        '<div id="datePostCont">' + moment(date).locale('pt-br').format('llll') + '</div>'+
        '<div id="postCont">' + descricao + '</div></div>';
        
        $("#agendacont-cont").html(agendacontcont);

}   

myApp.onPageInit('agenda', function (page) {
/* calendario */
    var today = new Date();
    var minDate = new Date().setDate(today.getDate() - 1);
    var monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto' , 'Setembro' , 'Outubro', 'Novembro', 'Dezembro'];
    var dayNamesShort = ['Dom', 'Seg', 'Ter', 'Quar', 'Quin', 'Sex', 'Sáb']

    var calendarInline = myApp.calendar({
        container: '#calendar-inline-container',
        input: '#calendar-agendamentodeespaco',
        value: [new Date()],
        dayNamesShort: dayNamesShort,
        dateFormat: 'dd-mm-yyyy',
        minDate: minDate,
        toolbarTemplate: 
            '<div class="toolbar calendar-custom-toolbar">' +
                '<div class="toolbar-inner">' +
                    '<div class="left">' +
                        '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' +
                    '</div>' +
                    '<div class="center"></div>' +
                    '<div class="right">' +
                        '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' +
                    '</div>' +
                '</div>' +
            '</div>',
        onOpen: function (p) {
            $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
            $$('.calendar-custom-toolbar .left .link').on('click', function () {
                calendarInline.prevMonth();
            });
            $$('.calendar-custom-toolbar .right .link').on('click', function () {
                calendarInline.nextMonth();
            });
            
        },
        onChange: function (picker, values, displayValues) {
            //console.log(picker+" | "+ values +" | "+ displayValues)
            mesSelected = $('#calendar-inline-container .picker-calendar-day-selected').attr("data-month");
            mesSelected = mesSelected+++1;
            diaSelected = $('#calendar-inline-container .picker-calendar-day-selected').attr("data-day");
            //$$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);

            if (diaSelected<10) {
                diaSelected = "0"+diaSelected;
            }
            anoSelected = $('#calendar-inline-container .picker-calendar-day-selected').attr("data-year");
            dataSelected = anoSelected+"-"+mesSelected+"-"+diaSelected;
            
            var dataSelectedBr = diaSelected+"/"+mesSelected+"/"+anoSelected;

            //$('.selecionarespaco').html(localDescSelected);
            $("#dataagendamento").val(dataSelectedBr);

            agenda(dataSelected);

        },
        onMonthYearChangeStart: function (p) {
            $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
            
            mesSelected = $('#calendar-inline-container .picker-calendar-day-selected').attr("data-month");
            mesSelected = mesSelected+++1;
            diaSelected = $('#calendar-inline-container .picker-calendar-day-selected').attr("data-day");
            
            if (diaSelected<10) {
                diaSelected = "0"+diaSelected;
            }
            //diaSelected ="01";
            anoSelected = $('#calendar-inline-container .picker-calendar-day-selected').attr("data-year");
            dataSelected = anoSelected+"-"+mesSelected+"-"+diaSelected;
            
            var dataSelectedBr = diaSelected+"/"+mesSelected+"/"+anoSelected;

            //$('.selecionarespaco').html(localDescSelected);
            $("#dataagendamento").val(dataSelectedBr);
            agenda(dataSelected);
        }
    });

});

/* videos */
// Pull to refresh content
var ptrContent = $$('.videos');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {

        videos();
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
});

function videos(){
    myApp.showIndicator();
    var datacont = "";
    var datavideo = [];
    var datayoutube;
    $.get(
        "https://www.googleapis.com/youtube/v3/search",{
        part : 'id,snippet', 
        maxResults : 20,
        //id: 'UCpk58NDdaKdX0QiiA2e79tg',
        type: 'video',
        order: 'date',
        channelId: 'UCNXPNr05-4q3GvGcJaMsiXg',
        //playlistId : pid,
        key: 'AIzaSyAB8ZuJzAX2m3xRhNhXFu9b654LvOgPOHg'},
        function(data) {
            
            $.each( data.items, function( i, item ) {

                // lista videos de 2018
                var ano = item.snippet.publishedAt.substring(0,4);
                if (ano>=2018) {

                    datavideo='https://www.youtube.com/embed/'+item.id.videoId+'?rel=0&amp;showinfo=0';
                    datayoutube='https://www.youtube.com/watch?v='+item.id.videoId;
                    myPhotoBrowserVideo = myApp.photoBrowser({
                        theme: 'dark',
                        ofText: 'de',
                        backLinkText: '',
                        spaceBetween: 0,
                        navbar: true,
                        toolbar: false,
                        photos : datavideo,
                        type: 'popup'
                    });
                    videoZoom = 'onclick=exibevideos("'+datavideo+'")'; 

                    datacont += '<li>'+
                                    '<div class="card-cont ks-facebook-card">'+
                                        '<a href="#exibevideos" '+videoZoom+' class="item-link">'+
                                            '<div class="card-content">'+
                                                '<i class="fa zoomVideo fa-youtube-play fa-3x"></i>'+
                                                '<img src="http://i.ytimg.com/vi/'+item.id.videoId+'/mqdefault.jpg" width="100%">'+
                                            '</div>'+
                                        '</a>'+
                                        '<div class="card-header">'+
                                            '<div class="ks-facebook-avatar"><img src="images/logo-appcaupe.png" width="34"></div>'+
                                                '<div class="ks-facebook-name">'+item.snippet.channelTitle+'</div>'+
                                                '<div class="ks-facebook-date">'+moment(item.snippet.publishedAt).locale('pt-br').format('llll')+'</div>'+
                                            '</div>'+
                                            '<div class="card-content-inner">'+
                                                '<p class="facebook-titlevideo">'+item.snippet.title+'</p>'+
                                                '<p class="facebook-subtitle">'+item.snippet.description+'</p>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</li>';
                }
            });
            //console.log(datavideo);
            myApp.hideIndicator();
            $('#videos-cont').html(datacont);
        }
    );
} 
//////////////////////////////// exibe videos //////////////////////
function exibevideos(data){

    //$('#exibecamerasdeseguranca-cont').html(data);
    //intel.xdk.device.setRotateOrientation("landscape");
    //onlandscape();
    $("#exibevideos-cont").attr('src',data);
    
}

function closevideo(){
    $("#exibevideos-cont").attr('src','');
}


/* noticias */

// Pull to refresh content
var ptrContent = $$('.noticias');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {

        noticias();
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
});

/* list noticias */
function noticias() {
    var url = $serverCau + "?json=get_category_posts&count=10&id=1";
    $("#noticias-cont").empty();
    
    myApp.showIndicator();
    url+= "&data=" + new Date().getTime();

    $.ajax({
        url: url,
        dataType : "json",
        success: function(data) {
            console.log("noticias");
            var qtd = data.posts.length;
            var imgNoticias = "";
            var dataNoticias = "";
            for (var i = 0; i < qtd; i++) {

                if (data.posts[i].thumbnail_images) {
                    imgNoticias = '<div class="card-content"><img src="'+data.posts[i].thumbnail_images["medium"]["url"]+'" width="100%"></div>';
                }else{
                    imgNoticias = '<div class="card-content"><img src="images/sem_foto_cont.jpg" width="100%"></div>';
                }
                dataNoticias += '<li>'+
                                    '<a href="#noticiascont" onclick="noticiascont('+data.posts[i].id+');" class="item-link">'+
                                        '<div class="card-cont ks-facebook-card">'+
                                            '<div class="card-header no-padding">'+
                                                imgNoticias+
                                                '<div class="card-content-inner">'+
                                                    '<div class="noticias-date">'+formata_data_extenso(data.posts[i].date)+'</div>'+
                                                    '<p class="noticias-title">'+data.posts[i].title_plain+'</p>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</a>'+
                                '</li>';
            }
            $('#noticias-cont').html(dataNoticias);
            myApp.hideIndicator();
        },error:function(data){
            myApp.hideIndicator();
         }
    });
}
 /* exibe noticias */ 
function noticiascont(id) {
    myApp.showIndicator();
    $(".noticiascont-cont").empty();
    var url = $serverCau + "?json=get_post&post_id=" + id;
    url+= "&data=" + new Date().getTime();


    $.getJSON(url, function (data) {
    var noticiascontcont = "";
    var noticiascontimg = "";
    var imgZoom;

        //$(alvo).html(JSON.stringify(data))

        if (data.post.thumbnail){

            myPhotoBrowserPropostacont = myApp.photoBrowser({
                theme: 'dark',
                ofText: 'de',
                backLinkText: '',
                spaceBetween: 0,
                navbar: true,
                toolbar: false,
                photos : [data.post.thumbnail_images.full.url],
                type: 'popup'
            });

            imgZoom = "onclick=myPhotoBrowserPropostacont.open();";
            noticiascontimg = '<div id="thumbPostCont">'+
                                '<i '+imgZoom+' class="fa fa-search-plus fa-3x"></i>'+
                                '<img src="' + data.post.thumbnail_images["full"]["url"] + '" '+imgZoom+'>'+
                            '</div>';
        }

            noticiascontcont += noticiascontimg+
            '<div class="containerPostCont"><div id="titPostCont">' + data.post.title_plain + '</div>'+
            '<div id="datePostCont">' + formata_data_extenso(data.post.date) + '</div>'+
            '<div id="postCont">' + data.post.content + '</div></div>';

            $(".noticiascont-cont").html(noticiascontcont);
            myApp.hideIndicator();

    });
    

}

// Pull to refresh content
var ptrContent = $$('.instagram');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {

        instagram();
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
});
 /* listar fotos */ 
function instagram(){
      /*$.instagramFeed({
        'username': 'oficialcaupe',
        'get_raw_json': true,
        'callback': displayRaw
      });*/
      console.log("entrei");
    myApp.showIndicator();
    jQuery.fn.spectragram.accessData = {
        accessToken: '2901947181.bc771ec.82a8ee1084034d93ace622a04717f9ca'
    };

    $('#fotos-cont').spectragram('getUserFeed',{
        complete : myCallbackFunc(),
        max: 20,
        size: "medium"
    });

}
function myCallbackFunc(argument) {
    
    setTimeout(function () {
        //$("#fotos-cont li a").attr("target","_system");
        console.log("sai");
        myApp.hideIndicator();

        $$('#fotos-cont li a').on('click', function (e) {
            console.log($(this).attr("href"));
            cordova.InAppBrowser.open($(this).attr("href"),"_system");
        });

    }, 3000);
    
}



/*
 Limpa os arquivos selecionados
 */
function limpar()
{
    var input = $("#imagem");
    input.replaceWith(input.val('').clone(true));
}
//////////////////////////// Alterar de cidade ///////////////////////////////////////////////////
function alteraCidade(id){
    localStorage.setItem("idCidade", id);
    window.location = "index.html";
}
//////////////////////////// Get Location ///////////////////////////////////////////////////

function getLocation(){
    console.log("getLocation");
    navigator.geolocation.getCurrentPosition(onSuccess);
        function onSuccess(pos){
            console.log(pos.coords.latitude+" - "+pos.coords.longitude);
            localStorage.setItem("userLatitude", pos.coords.latitude);
            localStorage.setItem("userLongitude", pos.coords.longitude);
        }
}

myApp.onPageReinit('maps', function (page) {
    maps();
});
///////////////////////// maps aqui perto ////////////////////////
var map;

function maps(){
    ofertasListMap = [];
    ofertasMap = [];

    $.ajax({
        url: $server+"Gerar_json.php?idCidade=1&op=oferta&full=1",
        dataType : "json",
        success: function(data) {
            //console.log(data);
            if (data!=null) {
                var qtd = data.oferta.length;
                var imgOferta = "";
                var dataOferta = "";
                var opcoes = false;
                var info;
                var idCategoria;

                for (var i = 0; i < qtd; i++) {

                    if (data.oferta[i].Opcoes) {
                        opcoes = true;
                    }
                
                    idCategoria = data.oferta[i].IdCategoria;
                    data.oferta[i].Img[0] = data.oferta[i].Img[0].replace("http://","https://");

                    info = '<a href="#ofertascont" onclick="ofertascont('+data.oferta[i].Id+','+idCategoria+','+opcoes+',\'home\');">'+
                                '<div style="display:block;max-width:360px;height:80px;overflow: hidden;">'+
                                    '<div style="width:80px;height:80px;float:left;overflow: auto;">'+
                                        '<img src="'+data.oferta[i].Img[0]+'" style="height:80px;padding-right:5px">'+
                                    '</div>'+
                                    '<div style="max-width:100px;height:80px;float:left;margin-left:5px;">'+
                                        '<strong>'+data.oferta[i].EmpresaNome.substring(0, 20)+'</strong><br>'+
                                        data.oferta[i].Titulo.substring(0, 40)+'<br>'+
                                    '</div>'+
                                '</div>'+
                            '</a>';
                    ofertasListMap.push(info);
                    ofertasListMap.push(data.oferta[i].Latitude);
                    ofertasListMap.push(data.oferta[i].Longitude);
                    ofertasListMap.push(i);
                    ofertasListMap.push(idCategoria);
                    servidor = "dentro";
                    ofertasMap.push(ofertasListMap);
                    ofertasListMap = [];

                }
                localStorage.setItem("ofertasMap", JSON.stringify(ofertasMap));
                //console.log(ofertasMap);
            }
        }
        ,error:function(data){
            localStorage.setItem("ofertasMap","");
        }
    });

    setTimeout("ofertasMaps()",1000);

}

function ofertasMaps(){
    var locations = [];
    if (localStorage.getItem("ofertasMap")!="") {
        locations = jQuery.parseJSON(localStorage.getItem("ofertasMap"));
    }

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: new google.maps.LatLng(localStorage.getItem("userLatitude"),localStorage.getItem("userLongitude")),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow({});

    var marker, i;

    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map,
            icon: {url: 'images/icon-maps-'+locations[i][4]+'.png'}
        });

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
}


        
/////////////////////////// push ////////////////////////////

document.addEventListener('app.Ready', onDeviceReady, true);
function onDeviceReady() {
    console.log("onDeviceReady");

    /*var push = PushNotification.init({
        android: {
            senderID: "214666097431",
            icon: "icon-notification",
            iconColor: "#004a73"
        },
        ios: {
            senderID: "214666097431",
            gcmSandbox: "true", // false para producao true para desenvolvimento
            alert: "true",
            sound: "true",
            badge: "false"
        },
        windows: {}
    });
    push.on('registration', function(data) {
        console.log('APARELHO REGISTRADO:' + data.registrationId);
        localStorage.setItem("token", data.registrationId);
        atualizartoken();
    });
    
    push.on('notification', function(data) {

        //$('#push').html(data);
        if (data.additionalData.foreground) {

            console.log('CAPTURADO PUSH COM APP ABERTO!');
            if (data.title==data.additionalData.summaryText) {
                data.additionalData.summaryText="";
            }

            myApp.addNotification({
                title: data.title,
                subtitle: data.additionalData.summaryText,
                message: data.message,
                closeIcon: false,
                media: '<img src='+data.additionalData.picture+'>',
            });
        } else if (data.additionalData.coldstart){

                console.log('CAPTURADO PUSH COM APP EM COLDSTART!');
        } else{

                console.log('CAPTURADO PUSH COM APP EM BACKGROUND!');  
        }

        console.log(data);
        console.log('TITULO: ' + data.title);
        console.log('SUBTITULO: ' + data.additionalData.summaryText);
        console.log('MEDIA: ' + data.additionalData.picture);
        console.log('MENSAGEM: ' + data.message);
        console.log('INFO: ' + data.additionalData.info);
    });

    push.on('error', function(e) {
        console.log(e.message);
        //$('#push').html(e.message);
    });*/

    setTimeout("getLocation()",2000);
}


function dataamericana(data){
    split = data.split('/');
    novadata = split[2] + "-" +split[1]+"-"+split[0];
    //data_americana = new Date(novadata);
    //alert(novadata);
    return (novadata);
}
function convertMysqldate(dateStr) {    
// Assuming input:2014-01-30 16:21:09
            var t = dateStr.split(/[- :]/);
            //var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
            var monthNames = ["01", "02", "03", "04", "05", "06","07", "08", "09", "10", "11", "12"];
            var year = t[0];
            var month = monthNames[parseInt(t[1]-1)];
            var day = t[2];
            var hourTmp = t[3];
            var minute = t[4];
            var seconds = t[5];
            if (parseInt(hourTmp) > 12) {
                var hour = parseInt(parseInt(hourTmp) - 12) + ':' + minute + ':' + seconds + ' PM';
            } else if (parseInt(hourTmp) === 12) {
                hour = parseInt(hourTmp) + ':' + minute + ':' + seconds + ' PM';
            } else {
               hour = parseInt(hourTmp) + ':' + minute + ':' + seconds + ' AM';
            }
            //return (hour + '<br>' + day + ' ' + month + ' ' + year);
            return (day + '/' + month + '/' + year +' - '+ hour);
}

function convertToAmericanDate(dateStr) {    
// Assuming input:2014-01-30 16:21:09
            var t = dateStr.split(/[/ :]/);
            //var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
            var monthNames = ["01", "02", "03", "04", "05", "06","07", "08", "09", "10", "11", "12"];
            var year = t[0];
            var month = monthNames[parseInt(t[1]-1)];
            var day = t[2];
            var hourTmp = t[3];
            var minute = t[4];
            var seconds = t[5];
            if (parseInt(hourTmp) > 12) {
                var hour = parseInt(parseInt(hourTmp) - 12) + ':' + minute + ':' + seconds + ' PM';
            } else if (parseInt(hourTmp) === 12) {
                hour = parseInt(hourTmp) + ':' + minute + ':' + seconds + ' PM';
            } else {
               hour = parseInt(hourTmp) + ':' + minute + ':' + seconds + ' AM';
            }
            //return (hour + '<br>' + day + ' ' + month + ' ' + year);
            //return (year + '/' + month + '/' + day +' - '+ hour);
            return (day + '/' + month + '/' + year +' - '+ hour);
}

function formatDate(dateStr) {    
// Assuming input:2014-01-30 16:21:09
            var t = dateStr.split(/[- :]/);
            //var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
            var monthNames = ["01", "02", "03", "04", "05", "06","07", "08", "09", "10", "11", "12"];
            var year = t[0];
            var month = monthNames[parseInt(t[1]-1)];
            var day = t[2];

            return (day + '/' + month + '/' + year);
}

function formatTime(secs){
   var times = new Array(3600, 60, 1);
   var time = '';
   var tmp;
   for(var i = 0; i < times.length; i++){
      tmp = Math.floor(secs / times[i]);
      if(tmp < 1){
         tmp = '00';
      }
      else if(tmp < 10){
         tmp = '0' + tmp;
      }
      time += tmp;
      if(i < 2){
         time += ':';
      }
      secs = secs % times[i];
   }
   return time;
}

function getMoney( str )
{
        return parseInt( str.replace(/[\D]+/g,'') );
}

function formatReal( int )
{
        var tmp = int+'';
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        if( tmp.length > 6 )
                tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");

        return tmp;
}
function formata_data_extenso(strDate)
{
    meses = new Array("Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro");

    hoje = strDate;
    dia = strDate.substring(8,10);
    mes = strDate.substring(5,7);
    ano = strDate.substring(0,4);
    //2014-06-27
    diaext = dia + " de " + meses[mes-1] + " de " + ano;
    return diaext;

}