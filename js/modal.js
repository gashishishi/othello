jQuery(function($){
    const modal = $('.modal');
    const buttonClose = $('.modal-close');
    const startModal = $('#startModal');
    const endModal = $('#endModal');

    // ページを開いたらモーダルを開く
    startModalOpen();

    // 先手後手が選ばれるか、バツをクリックされたらモーダルを閉じる
    $('.modal-close').on('click',modalClose);
    
    // バツ印がクリックされた時
    buttonClose.on('click', modalClose);

    /**
     * モーダルを開く
     */
    function startModalOpen() {
      startModal.css("display","block");
    }
    
    function modalClose() {
      modal.css("display","none");
    }



});