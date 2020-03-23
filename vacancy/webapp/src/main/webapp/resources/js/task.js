let context;
const vacancyUrl = "vacancy";

$(function () {
    let ctx = {
        url: vacancyUrl,
        tableUrl: vacancyUrl,
        idRequired: true,
    };

    ctx.tableUpdateUrl = ctx.tableUrl + '?action=find&taskId=' + taskId + (profileId ? '&userId=' + profileId : '');
    ctx.afterSuccess = function () {
        $.get(ctx.tableUpdateUrl, fillTableByData)
    };
    context = ctx;
    makeDynamicTable(true);
});

const datatableOpts = {
    "columns": [
        {
            "defaultContent": "Title",
            "render": function (data, type, row) {
                if (type === 'display' || type === 'sort' || type === 'filter') {
                    return '<a href="' + row.data.url + '">' + row.data.title + '</a>';
                }
                return data;
            }
        },
        {
            "data": "data.description"
        },
        {
            "defaultContent": "Date",
            "render": function (data, type, row) {
                if (type === 'display' || type === 'sort' || type === 'filter') {
                    return row.data.dateTime;
                }
                return data;
            }
        },
        {
            "defaultContent": "Highlight",
            "orderable": false,
            "render": renderHighlightButton
        },
        {
            "defaultContent": "Delete",
            "orderable": false,
            "render": renderDeleteButton
        }

    ],
    "order": [
        [2, "desc"]
    ],
    "createdRow": function (row, data, dataIndex) {
        $(row).attr("highlighted", data.highlighted);
    }
};

function renderHighlightButton(data, type, row) {
    if (type === "display") {
        return '<input type="checkbox" ' + (row.highlighted === true ? ' checked' : '') +' onclick="highlight($(this), ' + row.id +  ')">';
    }
}

function highlight(checkbox, id) {
    const checked = checkbox.is(":checked");
    $.ajax({
        url: vacancyUrl,
        type: 'POST',
        data: 'highlighted=' + checked + '&id=' + id + '&taskId=' + taskId + (profileId ? '&userId=' + profileId : '')
    }).done(function () {
        checkbox.closest("tr").attr("highlighted", checked);
        successNoty(checked ? 'Task highlighted' : 'Task highlighted off');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $(checkbox).prop("checked", !checked);
    })
}

function doDeleteItem(id) {
    console.log('delete item');
    if (confirm("Are you sure?")) {
        $.ajax({
            url: vacancyUrl + '?action=delete&id=' + id + '&taskId=' + taskId + (profileId ? '&userId=' + profileId : ''),
            type: 'POST'
        }).done(function () {
            context.afterSuccess();
            successNoty('Task deleted');
        })
    }
}