type OrgStats struct {
    Month      string `db:"month"`
    IPCount    int    `db:"ip_count"`
    TOOCount   int    `db:"too_count"`
    OtherCount int    `db:"other_count"`
}

type OrgOther struct {
    IdentificationNumber string    `db:"identification_number"`
    Name                 *string   `db:"name"`
    CreatedDate          time.Time `db:"created_date"`
}

type Response struct {
    Stats []OrgStats `json:"stats"`
    Other []OrgOther `json:"other"`
}

func GetOrgReport(c echo.Context) error {
    var stats []OrgStats
    var others []OrgOther

    from := c.QueryParam("from")
    to := c.QueryParam("to")

    // 1. агрегат
    err := pg.DB().Select(&stats, queryStats, from, to)
    if err != nil {
        return c.JSON(500, err.Error())
    }

    // 2. детали
    err = pg.DB().Select(&others, queryOther, from, to)
    if err != nil {
        return c.JSON(500, err.Error())
    }

    return c.JSON(200, Response{
        Stats: stats,
        Other: others,
    })
}


const OrgReportView = {
    template: `
    <div>
        <h2>Отчет по организациям</h2>

        <!-- ФИЛЬТР -->
        <div style="margin-bottom: 15px;">
            <label>С даты:</label>
            <input type="date" v-model="dateFrom">

            <label>По дату:</label>
            <input type="date" v-model="dateTo">

            <button @click="loadReport">Показать</button>
        </div>

        <!-- ТАБЛИЦА СТАТИСТИКИ -->
        <h3>Статистика по месяцам</h3>

        <table border="1" cellpadding="5">
            <thead>
                <tr>
                    <th>Месяц</th>
                    <th>IP</th>
                    <th>TOO</th>
                    <th>OTHER</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in stats" :key="row.month">
                    <td>{{ row.month }}</td>
                    <td>{{ row.ip_count }}</td>
                    <td>{{ row.too_count }}</td>
                    <td>{{ row.other_count }}</td>
                </tr>
            </tbody>
        </table>

        <!-- ТАБЛИЦА OTHER -->
        <h3 style="margin-top:20px;">Прочие организации (OTHER)</h3>

        <table border="1" cellpadding="5">
            <thead>
                <tr>
                    <th>BIN</th>
                    <th>Название</th>
                    <th>Дата</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in others" :key="item.identification_number">
                    <td>{{ item.identification_number }}</td>
                    <td>{{ item.name || 'NULL' }}</td>
                    <td>{{ formatDate(item.created_date) }}</td>
                </tr>
            </tbody>
        </table>

    </div>
    `,

    data() {
        return {
            dateFrom: '',
            dateTo: '',
            stats: [],
            others: []
        }
    },

    methods: {
        loadReport() {
            axios.get('/org-report', {
                params: {
                    from: this.dateFrom,
                    to: this.dateTo
                }
            })
            .then(res => {
                this.stats = res.data.stats
                this.others = res.data.other
            })
            .catch(err => {
                console.error("Ошибка загрузки отчета", err)
            })
        },

        formatDate(date) {
            if (!date) return ''
            return date.substring(0, 10)
        }
    }
}