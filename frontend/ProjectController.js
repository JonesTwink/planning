var data;

$(document).ready(function () {
    getData();
    buildGrid();

    $('body').on('click', '.project-card', function (event) {
        event.stopPropagation();
        toggleElement('.project-grid','hide', 'left');
        $('.add-project-button').hide();
        fillProjectContent($(this));
        $('.project-wrapper').fadeIn(700);
    });

    $('.back-button').on('click', function () {
        $('.project-wrapper').fadeOut(200);
        $('.project-wrapper').find('.task-list').html('');
        toggleElement('.project-grid','show','left');
        $('.add-project-button').show();

    });

    $('body').on('click', '.subtask-list-button', function (event) {
        event.stopPropagation();
        var $this = $(this);
        if ($this.parents('.task-item').hasClass('active')){
            $this.parents('.task-item').removeClass('active');
            $this.children('.fa').removeClass('fa-chevron-left').addClass('fa-chevron-right');
        } else{
            $this.parents('.task-item').addClass('active');
            $this.children('.fa').removeClass('fa-chevron-right').addClass('fa-chevron-left');
        }

    });

    $('.new-task-button').on('click', function () {
        $('#add-task-bg').css('display', 'flex');
    });

    $('.project-wrapper').on('click', '.add-subtask-button', function () {
        $('#add-subtask-bg').css('display', 'flex');
        setParentTaskIdForSubtask($(this));
    });
    $('.add-project-button').on('click',function () {
        $('#add-project-bg').css('display', 'flex');
    });


    $('.modal-bg').on('click', function () {
        $(this).css('display', 'none');
    });
    $('.form-button.cancel').on('click', function () {
        $(this).parents('.modal-bg').css('display', 'none');
    });
    $('.modal-form').on('click', function (event) {
       event.stopPropagation();
    });

});

function setParentTaskIdForSubtask($this) {
    var parentTaskId = $this.parents('.task-info').find('#id').val();
    $('#add-subtask-modal').find('#parent-task-id').val(parentTaskId);
    console.log(  $('#add-subtask-modal').find('#parent-task-id').val());
}
function fillProjectContent($projectCard) {
    $this = $('.project-wrapper');
    var project = findEntityById($projectCard.find('#id').val(), data);
    $this.find('#project-title').text(project.title);
    buildTaskList(project);

}
function buildTaskList(project){
    $('<div class="task-item"></div>').load('templates/task-item.html', function () {
        var tpl = $(this);
        $.each(project.tasks, function (index, task) {
            var taskTpl = tpl.clone();
            taskTpl.find('.task-status').html(resolveStatusString(task.status));
            taskTpl.find('.task-title').html(task.title);
            taskTpl.find('.task-createdAt').children('.value').html(task.createdAt);
            taskTpl.find('.task-deadline').children('.value').html(task.deadline);
            taskTpl.find('#id').val(task.id);
            var subtaskList = buildSubtaskList(task.subtasks, $(taskTpl).find('.subtask-list'));
            taskTpl.find('.subtask-list').html(subtaskList.html());

            $('.project-wrapper').find('.task-list').prepend(taskTpl);
        });
    });

}

function buildSubtaskList(subtasks, $subtaskList) {

    $('<div class="subtask-item"></div>').load('templates/subtask-item.html', function () {
        var tpl = $(this);
        $.each(subtasks, function (index, subtask) {
            var subtaskTpl = tpl.clone();
            subtaskTpl.find('.subtask-status').html(resolveStatusString(subtask.status));
            subtaskTpl.find('.subtask-title').html(subtask.title);
            subtaskTpl.find('.subtask-createdAt').children('.value').html(subtask.createdAt);
            subtaskTpl.find('.subtask-deadline').children('.value').html(subtask.deadline);
            $subtaskList.prepend(subtaskTpl);
        });
    });
    return $subtaskList;
}
function findEntityById(id, array) {
    var selectedEntity;
    $.each(array, function (index, entity) {
        if (entity.id === id){
            selectedEntity = entity;
            return;
        }
    });
    return selectedEntity;
}

function toggleElement(selector, action, fromDirection) {
    if (action === 'hide'){
        $('body').css('overflow', 'hidden');
        $(selector).css('transition', '0.2s margin ease');
        $(selector).css('margin-'+fromDirection, '100vw');
        $(selector).fadeOut(300);
    }
    else if (action === 'show'){
        $(selector).fadeIn(300);
        $(selector).css('margin-'+fromDirection, '0');
        $('body').css('overflow', 'auto');
    }
}

function buildGrid(){
    $('<div class="project-card"></div>').load('templates/project-card.html', function () {
        var tpl = $(this);
        $.each(data, function(index, project){
            var projectCard = tpl.clone();

            var taskInfo =  findCompleteAndOverdueTasksAmount(project.tasks);

            projectCard.find('.project-title').text(project.title);
            projectCard.find('.tasks-total .value').text(project.tasks.length);
            projectCard.find('.tasks-complete .value').text(taskInfo.complete);
            projectCard.find('.tasks-overdue .value').text(taskInfo.overdue);
            projectCard.find('#id').val(project.id);
            $('body').find('.project-grid').prepend(projectCard);
        });
    });
}

function findCompleteAndOverdueTasksAmount(tasks) {
    var complete = 0;
    var overdue = 0;
    $.each(tasks, function (index, task) {
        if (task.status == 'complete')
            complete++;
        if (task.status == 'overdue')
            overdue++;
    });

    return {complete: complete, overdue: overdue};
}

function resolveStatusString(status) {
    var response;
    switch (status){
        case 'pending':
            response =  '<span style="color: #fc0">Выполняется</span>';
            break;
        case 'overdue':
            response = '<span style="color: darkred">Просрочено</span>';
            break;
        case 'complete':
            response = '<span style="color: green">Выполнено</span>';
            break;
        case 'complete(overdue)':
            response = '<span style="color: indianred">Выполнено(просрочено)</span>';
            break;
    }
    return response;
}

function getData(){
    data = [
                {
                    id: '1',
                    title: 'Строим Треугольник',
                    tasks: [
                                            {
                                                id: '1',
                                                title: 'Освещение 1',
                                                createdAt:'01.01.2017',
                                                deadline:'01.02.2020',
                                                status: 'overdue',
                                                subtasks:[
                                                            {
                                                                title: 'Согласовать с архитектором',
                                                                status: 'pending',
                                                                comment: 'Some text',
                                                                createdAt:'01.01.2017',
                                                                deadline: '01.01.2019'
                                                            },
                                                            {
                                                                title: 'Согласовать с архитектором 2',
                                                                status: 'overdue',
                                                                comment: 'Some text',
                                                                createdAt:'01.01.2017',
                                                                deadline: '01.02.2017'
                                                            }
                                                ]
                                            },

                                            {
                                                id: '2',
                                                title: 'Освещение 1.2',
                                                createdAt:'01.01.2017',
                                                deadline:'01.02.2020',
                                                status: 'pending',
                                                subtasks:[
                                                    {
                                                        id: '1',
                                                        title: 'Согласовать с архитектором',
                                                        status: 'pending',
                                                        comment: 'Some text',
                                                        createdAt:'01.01.2017',
                                                        deadline: '01.01.2019'
                                                    },
                                                    {
                                                        id: '2',
                                                        title: 'Согласовать с архитектором 2',
                                                        status: 'complete',
                                                        comment: 'Some text',
                                                        createdAt:'01.01.2017',
                                                        deadline: '03.02.2019'
                                                    }
                                                ]
                                            },
                            ]
                },

                {
                    id: '2',
                    title: 'Строим Могилёв',
                    tasks: [
                        {
                            id: '1',
                            title: 'Освещение Освещение Освещение Освещение 2',
                            createdAt:'01.01.2017',
                            deadline:'01.02.2020',
                            status: 'complete',
                            subtasks:[
                                {
                                    id: '1',
                                    title: 'Согласовать с архитектором',
                                    status: 'pending',
                                    comment: 'Some text',
                                    createdAt:'01.01.2017',
                                    deadline: '01.01.2019'
                                },
                                {
                                    id: '2',
                                    title: 'Согласовать с архитектором 2',
                                    status: 'pending',
                                    comment: 'Some text',
                                    createdAt:'01.01.2017',
                                    deadline: '03.02.2019'
                                }
                            ]
                        },

                        {
                            id: '2',
                            title: 'Освещение 2.2',
                            createdAt:'01.01.2017',
                            deadline:'01.02.2020',
                            status: 'pending',
                            subtasks:[
                                {
                                    id: '1',
                                    title: 'Согласовать с архитектором',
                                    status: 'pending',
                                    comment: 'Some text',
                                    createdAt:'01.01.2017',
                                    deadline: '01.01.2019'
                                },
                                {
                                    id: '2',
                                    title: 'Согласовать с архитектором 2',
                                    status: 'pending',
                                    comment: 'Some text',
                                    createdAt:'01.01.2017',
                                    deadline: '03.02.2019'
                                }
                            ]
                        },
                    ]
                },
            ];
}