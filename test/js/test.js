var angular = angular || {};
angular.module('test', [])
  .directive('form', function($http){
    return {
      restrict: 'A',
      scope: true,
      replace: false,
      link: function(scope){

        scope.test_state = 1;

        scope.result = 0;

        var test = [
          {
            text: 'Логотип компании:',
            answers: ['Белыми буквами на черном фоне', 'Черными буквами на белом фоне'],
            value: 0
          },
          {
            text: 'Что больше любите?',
            answers: ['Отжиматься', 'Подтягиваться'],
            value: 0
          },
          {
            text: 'Какой собакой хотели бы быть?',
            answers: ['Дикой в лесу', 'Домашней во дворце'],
            value: 0
          },
          {
            text: 'Чтобы посмотрели в первую очередь?',
            answers: ['Топ лайков', 'Топ дислайков'],
            value: 0
          },
          {
            text: 'При принятии решений чаще руководствуетесь ...',
            answers: ['Сердцем', 'Головой'],
            value: 0
          },
          {
            text: 'Вам больше нравиться соревноваться ...',
            answers: ['С соперником', 'С самим собой'],
            value: 0
          }
        ];

        scope.$watchCollection('test', function(){
          console.dir(scope.test);
        });

        scope.test = angular.copy(test);

        scope.submit_test = function(){

          if(!scope.test_valid()) return;

          console.dir(scope.test);

          var question_rate = 100/scope.test.length;

          var test_rate = 0;

          angular.forEach(scope.test, function(question){

            if(question.value === 2){
              test_rate += question_rate;
            }

          });

          scope.result = test_rate.toFixed(2);
          scope.test_state = 2;
        };

        scope.test_valid = function(){
          return scope.test.every(function(question){
            return question.value > 0;
          });
        };

        scope.test_again = function(){
          scope.test_state = 1;
          scope.result = 0;
          scope.test = angular.copy(test);
        };

        scope.share_fb = function(){
          FB.ui(
            {
              method: 'feed',
              name: 'Тест на социальную паранойю',
              link: 'http://rktdj.com/test',
//              picture: 'http://rktdj.com/test/img/paranoia_quad.gif',
              picture: 'http://ipsumimage.appspot.com/600x300?l=%D0%AF+%D0%BD%D0%B0+' + scope.result + '%|%D1%81%D0%BE%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D0%BF%D0%B0%D1%80%D0%B0%D0%BD%D0%BE%D0%B8%D0%BA&s=40&b=e1e1e1',
              caption: 'Кто еще рискнет пройти?',
              description: 'Я на ' + scope.result + '% социальный параноик'
            },
            function(response) {
              if (response && response.post_id) {
//                alert('Post was published.');
              } else {
//                alert('Post was not published.');
              }
            }
          );
        };
      }
    };
  });