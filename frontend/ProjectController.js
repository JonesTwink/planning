var globalProjectData;

$(document).ready(function () {
    getProjectsDataAndUpdateLayout('project');

    $('body').on('click', '.project-card', function (event) {
        event.stopPropagation();
        toggleElement('.project-grid','hide', 'left');
        $('.add-project-button').hide();
        fillProjectContent($(this), globalProjectData);
        $('.project-wrapper').show();
        setTimeout(function () {
            $('.project-wrapper').css('margin-left', '0');
        }, 300);
    });

    $('.back-button').on('click', function () {
        getProjectsDataAndUpdateLayout('project');
        $('.project-wrapper').css('margin-left', '-100vw');
        setTimeout(function(){
            $('.project-wrapper').hide();
            $('.project-wrapper').find('.task-list').html('');
            toggleElement('.project-grid','show','left');
            $('.add-project-button').show();
        }, 300);
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
        setParentProjectIdForTask();
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

    $('#add-project-modal .form-button.apply').on('click', function () {
        var appliedData = getProjectFormFields();
        $.ajax({
            type: "POST",
            url: 'backend/methods/addProject.php',
            data: appliedData,
            success: function (data) {
                console.log(appliedData);
                if(data.status === 'success'){
                    closeForm('#add-project-bg');
                    getProjectsDataAndUpdateLayout('project');
                } else{
                    alert(data.data);
                }
            }
        });
    });
    $('body').on('click','.delete-project-button', function (event) {
        event.stopPropagation();
        var deletionAccepted = confirm('Вы действительно хотите удалить проект?');
        if (deletionAccepted){
            var appliedData = { projectId: $(this).parents('.project-card').find('#id').val()};
            $.ajax({
                type: "POST",
                url: 'backend/methods/deleteProject.php',
                data: appliedData,
                success: function (data) {
                    console.log(appliedData);
                    if(data.status === 'success'){
                        getProjectsDataAndUpdateLayout('project');
                    } else{
                        alert(data.data);
                    }
                }
            });
        }
    });

    $('#add-task-modal .form-button.apply').on('click', function () {
        var appliedData = getTaskFormFields();
        if (!validateTaskFields(appliedData)){
            alert('Сроки уже заведомо просрочены. Выберите другую дату.')
            return;
        }
        $.ajax({
            type: "POST",
            url: 'backend/methods/addTask.php',
            data: appliedData,
            success: function (data) {
                if(data.status === 'success'){
                    closeForm('#add-task-bg');
                    var currentProjectId = $('.project-wrapper').find('#id').val();
                    getProjectsDataAndUpdateLayout('task', currentProjectId);
                } else{
                    alert(data.data);
                }
            }
        });
    });

    $('body').on('click','.delete-task-button', function (event) {
        event.stopPropagation();
        var deletionAccepted = confirm('Вы действительно хотите удалить задание?');
        if (deletionAccepted){
            var appliedData = { taskId: $(this).parents('.task-item').find('#id').val()};
            $.ajax({
                type: "POST",
                url: 'backend/methods/deleteTask.php',
                data: appliedData,
                success: function (data) {
                    console.log(appliedData);
                    if(data.status === 'success'){
                        var currentProjectId = $('.project-wrapper').find('#id').val();
                        getProjectsDataAndUpdateLayout('task', currentProjectId);
                    } else{
                        alert(data.data);
                    }
                }
            });
        }
    });

    $('#add-subtask-modal .form-button.apply').on('click', function () {
        var appliedData = getSubtaskFormFields();
        if (!validateSubtaskFields(appliedData)){
            alert('Дата должна быть в промежутке между текущей датой и датой сроков выполнения задания. Выберите другую дату.')
            return;
        }
        $.ajax({
            type: "POST",
            url: 'backend/methods/addSubtask.php',
            data: appliedData,
            success: function (data) {
                if(data.status === 'success'){
                    closeForm('#add-subtask-bg');
                    alert('Подзадача добавлена.');
                    var currentProjectId = $('.project-wrapper').find('#id').val();
                    getProjectsDataAndUpdateLayout('task', currentProjectId);
                } else{
                    alert(data.data);
                }
            }
        });
    });

    $('body').on('click','.subtask-button.delete', function (event) {
        var $this = $(this);
        var deletionAccepted = confirm('Вы действительно хотите удалить подзадачу?');
        if (deletionAccepted){
            var appliedData = { subtaskId: $this.parents('.subtask-item').find('#id').val()};
            $.ajax({
                type: "POST",
                url: 'backend/methods/deleteSubtask.php',
                data: appliedData,
                success: function (data) {
                    console.log(appliedData);
                    if(data.status === 'success'){
                        $this.parents('.subtask-item').remove();
                    } else{
                        alert(data.data);
                    }
                }
            });
        }
    });
    $('body').on('click','.subtask-button.check', function () {
        var $this = $(this);
        var appliedData = { subtaskId: $this.parents('.subtask-item').find('#id').val()};
        $.ajax({
            type: "POST",
            url: 'backend/methods/completeSubtask.php',
            data: appliedData,
            success: function (data) {
                console.log(appliedData);
                if(data.status === 'success'){
                    alert('Подзадача отмечена как выполненная.');
                    var currentProjectId = $('.project-wrapper').find('#id').val();
                    getProjectsDataAndUpdateLayout('subtask', currentProjectId);
                } else{
                    alert(data.data);
                }
            }
        });
    });

    $('body').on('click','.subtask-button.uncheck', function () {
        var $this = $(this);
        var appliedData = { subtaskId: $this.parents('.subtask-item').find('#id').val()};
        $.ajax({
            type: "POST",
            url: 'backend/methods/revertSubtask.php',
            data: appliedData,
            success: function (data) {
                console.log(appliedData);
                if(data.status === 'success'){
                    alert('С подзадачи снят статус "Выполнена".');
                    var currentProjectId = $('.project-wrapper').find('#id').val();
                    getProjectsDataAndUpdateLayout('subtask', currentProjectId);
                } else{
                    alert(data.data);
                }
            }
        });
    });

});

function getProjectFormFields() {
    $form = $('#add-project-modal');
    return {
        projectName:   $form.find('#project-name').val(),
        projectDeadline: $form.find('#project-deadline').val()
    }
}

function getTaskFormFields() {
    $form = $('#add-task-modal');
    return {
        taskName:   $form.find('#task-name').val(),
        taskDeadline: $form.find('#task-deadline').val(),
        parentId: $form.find('#parent-project-id').val()
    }
}
function getSubtaskFormFields() {
    $form = $('#add-subtask-modal');
    return {
        subtaskName:   $form.find('#subtask-name').val(),
        subtaskDeadline: $form.find('#subtask-deadline').val(),
        parentId: $form.find('#parent-task-id').val()
    }
}
function validateTaskFields(data) {
    var currentDate = new Date();
    console.log(data.taskDeadline)
    var datePartsArray = data.taskDeadline.split('-');
    var deadlineDate = new Date(datePartsArray[0], datePartsArray[1]-1, datePartsArray[2]);

    if(deadlineDate > currentDate)
        return true;
    else
        return false;
}
function validateSubtaskFields(data) {
    var currentDate = new Date();

    var currentProject = findEntityById($('.project-wrapper').find('#id').val(), globalProjectData);
    var parentTask = findEntityById(data.parentId, currentProject.tasks);

    var datePartsArray = parentTask.deadline.split(/[ -]/);
    var parentDeadlineDate = new Date(datePartsArray[0], datePartsArray[1]-1, datePartsArray[2]);

    datePartsArray = data.subtaskDeadline.split('-');
    var deadlineDate = new Date(datePartsArray[0], datePartsArray[1]-1, datePartsArray[2]);

    if(deadlineDate > currentDate)
        if (deadlineDate < parentDeadlineDate){
            return true;
        }
        else{
            return false;
        }
    else
        return false;
}

function closeForm(selector) {
    $(selector).find('.input-field').val('');
    $(selector).hide();
}

function setParentTaskIdForSubtask($this) {
    var parentTaskId = $this.parents('.task-info').find('#id').val();
    $('#add-subtask-modal').find('#parent-task-id').val(parentTaskId);
}

function setParentProjectIdForTask() {
    var parentProjectId = $('.project-wrapper').find('#id').val();
    $('#add-task-modal').find('#parent-project-id').val(parentProjectId);
}

function fillProjectContent($projectCard, data) {
    $this = $('.project-wrapper');
    var project = findEntityById($projectCard.find('#id').val(), data);
    $this.find('#project-title').text(project.title);
    $this.find('#id').val(project.id);
    buildTaskList(project);

}
function buildTaskList(project){
    $('<div class="task-item"></div>').load('templates/task-item.html', function () {
        var tpl = $(this);
        $('.project-wrapper').find('.task-list').html('');
        $.each(project.tasks, function (index, task) {
            var taskTpl = tpl.clone();
            taskTpl.find('.task-status').html(resolveStatusString(task.status));
            taskTpl.find('.task-title').html(task.title);
            taskTpl.find('.task-createdAt').children('.value').html(formatDate(task.createdAt));
            taskTpl.find('.task-deadline').children('.value').html(formatDate(task.deadline));
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
            subtaskTpl.find('#id').val(subtask.id);
            subtaskTpl.find('.subtask-status').html(resolveStatusString(subtask.status));
            subtaskTpl.find('.subtask-title').html(subtask.title);
            subtaskTpl.find('.subtask-createdAt').children('.value').html(formatDate(subtask.createdAt));
            subtaskTpl.find('.subtask-deadline').children('.value').html(formatDate(subtask.deadline));
            if (subtask.status == 'complete' || subtask.status == 'complete(overdue)'){
                subtaskTpl.find('.fa-check').addClass('fa-repeat').removeClass('fa-check');
                subtaskTpl.find('.subtask-button').addClass('uncheck').removeClass('check');
            }
            $subtaskList.prepend(subtaskTpl);
        });
    });
    return $subtaskList;
}

function findEntityById(id, array) {
    var selectedEntity;
    $.each(array, function (index, entity) {
        if (entity.id == id){
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
        $('body').css('overflow', 'auto');
    }
    else if (action === 'show'){
        $('body').css('overflow', 'hidden');
        $(selector).fadeIn(300);
        $(selector).css('margin-'+fromDirection, '0');
        $('body').css('overflow', 'auto');
    }
}

function buildGrid(data){
    $('body').find('.project-grid').children('.project-card').remove();
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
            response = '<span style="color: darkorange">Выполнено(просрочено)</span>';
            break;
    }
    return response;
}

function getProjectsDataAndUpdateLayout(elementType, parentId) {
    $.get('backend/methods/getAllProjectsData.php', function (data) {
        if (data.status === 'success'){
            globalProjectData = data.data;
            switch (elementType){
                case 'project':
                    buildGrid(data.data);
                    break;
                case 'task':
                    buildTaskList(findEntityById(parentId, data.data));
                    break;
                case 'subtask':
                    buildTaskList(findEntityById(parentId, data.data));
                    break;
            }
        }
        else{
            alert(data.data);
        }
    })
}

function formatDate(dateString) {
    var date  = new Date(dateString);

    var dd = date.getDate();
    dd = (dd <10)? '0' + dd : dd;

    var mm = date.getMonth()+1;
    mm = (mm <10)? '0' + mm : mm;

    var yyyy = date.getFullYear();
    return dd+'.'+mm+'.'+yyyy;
}