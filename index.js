import axios from "axios";

/**
 * This is the main class of eventiq javascript sdk.
 * This class contains state `project_id`, which is a public key for any project for tracking
 * This class contains different functions for different types of user events logging.
 */
export class EventIQ{
    URL = "http://localhost:9000/api/v1/public/event";

    constructor(project_id) {
        if (!project_id || typeof project_id !== 'string') {
            throw new Error("Invalid Project ID. Please check again.");
        }
        this.project_id = project_id;
    }

    click(id, metaData= {}){
        metaData.namespace = "namespace";
        this._processEvent({
            type: "CLICK",
            iq_project_id: this.project_id,
            metaData: metaData
        });
        console.log(metaData);
    }

    log(metaData = {}){
        if (metaData !== null){
            this._processEvent({
                type: "LOG",
                project_id: this.project_id,
                ...metaData
            });
            console.log(metaData);
        }
    }

    event(metaData = {}){
        if (metaData !== null){
            this._processEvent({
                type: "EVENT",
                project_id: this.project_id,
                ...metaData
            });
            console.log(metaData);
        }
    }

    _processEvent(event){
        console.log(event)
        axios.post(this.URL, event)
            .then(response => {
                console.debug("Event processed");
            }).catch(reportError => {
                console.log("Error Processing Event. Please try again.")
            });
    }
}