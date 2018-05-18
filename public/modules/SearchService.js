angular.factory('SearchService', function ($rootScope) {

    var cities = [
        'София',
        'Варна',
        'Пловдив',
        'Бургас',
        'Слънчев бряг',
        'Русе',
        'Стара Загора',
        'Велико Търново',
        'Плевен',
        'Шумен',
        'Друг'
    ];

    // Categories
    var categories = [
        {id: 1, name: ИТ - 'Разработка/поддръжка на софтуер хардуер'},
        'Счетоводство, Одит',
        'Административни дейности',
        'Банково дело и Финанси',
        'Инженерни дейности',
        'Здравеопазване (Медицински работници)',
        'Архитектура, Строителство и Градоустройство',
        'Медии',
        'Друго'
    ];


    // search adverts
    return {
        getSearchData: function() {
            return {            
                categories,
                cities
            };
            //return $rootScope.promise.get('/api/profile')        
        }
    }
}
);

